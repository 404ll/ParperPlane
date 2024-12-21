import { useState } from 'react';

export interface UploadedBlobInfo {
    blobId: string;
    endEpoch: number;
    suiRef: string;
    status: string;
}

export interface UploadBlobConfig {
    initialEpochs?: string;
    initialPublisherUrl?: string;
    initialAggregatorUrl?: string;
    proxyUrl?: string;
}

const DEFAULT_CONFIG: Required<UploadBlobConfig> = {
    initialEpochs: process.env.NEXT_PUBLIC_INITIAL_EPOCHS || '100',
    initialPublisherUrl: process.env.NEXT_PUBLIC_PUBLISHER_URL || 'https://walrus-testnet-publisher.nodeinfra.com',
    initialAggregatorUrl: process.env.NEXT_PUBLIC_AGGREGATOR_URL || 'https://aggregator-testnet.walrus.space',
    proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL || ''
};

export function useUploadBlob(config: UploadBlobConfig = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    const [epochs, setEpochs] = useState(finalConfig.initialEpochs);
    const [uploading, setUploading] = useState(false);
    const [uploadedBlobs, setUploadedBlobs] = useState<UploadedBlobInfo[]>([]);
    const [publisherUrl, setPublisherUrl] = useState(finalConfig.initialPublisherUrl);
    const [aggregatorUrl, setAggregatorUrl] = useState(finalConfig.initialAggregatorUrl);

    const storeBlob = async (fileOrUrl: File | string) => {
        setUploading(true);
        try {
            let body: File | Blob;
            if (typeof fileOrUrl === 'string') {
                console.log('Downloading from URL:', fileOrUrl);
                const response = await fetch(finalConfig.proxyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: fileOrUrl }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                body = await response.blob();
                console.log('Downloaded blob size:', body.size);
            } else {
                body = fileOrUrl;
                console.log('Using provided file, size:', body.size);
            }

            const response = await fetch(`${publisherUrl}/v1/store?epochs=${epochs}`, {
                method: 'PUT',
                body: body,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const info = await response.json();
            console.log('Publisher response:', JSON.stringify(info, null, 2));

            let blobInfo: UploadedBlobInfo;

            if ('alreadyCertified' in info) {
                console.log('Already certified blob:', {
                    blobId: info.alreadyCertified.blobId,
                    event: info.alreadyCertified.event,
                    endEpoch: info.alreadyCertified.endEpoch
                });
                blobInfo = {
                    status: 'Already certified',
                    blobId: info.alreadyCertified.blobId,
                    endEpoch: info.alreadyCertified.endEpoch,
                    suiRef: info.alreadyCertified.event?.txDigest || info.alreadyCertified.blobId,
                };
            } else if ('newlyCreated' in info) {
                console.log('Newly created blob:', {
                    blobId: info.newlyCreated.blobObject.blobId,
                    id: info.newlyCreated.blobObject.id,
                    endEpoch: info.newlyCreated.blobObject.storage.endEpoch
                });
                blobInfo = {
                    status: 'Newly created',
                    blobId: info.newlyCreated.blobObject.blobId,
                    endEpoch: info.newlyCreated.blobObject.storage.endEpoch,
                    suiRef: info.newlyCreated.blobObject.id,
                };
            } else {
                console.error('Unexpected response format:', info);
                throw new Error('Unexpected response format');
            }

            console.log('Final blobInfo:', blobInfo);
            setUploadedBlobs(prev => [blobInfo, ...prev]);
            return blobInfo;
        } catch (error) {
            console.error('Error in storeBlob:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        } finally {
            setUploading(false);
        }
    };

    return {
        epochs,
        setEpochs,
        uploading,
        uploadedBlobs,
        publisherUrl,
        setPublisherUrl,
        aggregatorUrl,
        setAggregatorUrl,
        storeBlob
    };
} 