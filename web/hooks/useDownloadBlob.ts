import { useState } from 'react';

export interface DownloadBlobInfo {
    blobId: string;
    imgSrc: URL;
}

export interface DownloadBlobConfig {
    initialAggregatorUrl?: string;
    proxyUrl?: string;
}

const DEFAULT_CONFIG: Required<DownloadBlobConfig> = {
    initialAggregatorUrl: process.env.NEXT_PUBLIC_AGGREGATOR_URL || 'https://walrus-testnet-aggregator.nodeinfra.com',
    proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL || ''
};

export function useDownloadBlob(config: DownloadBlobConfig = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const [blobUrl, setBlobUrl] = useState('');
    const [aggregatorUrl, setAggregatorUrl] = useState(finalConfig.initialAggregatorUrl);

    const downloadBlobToURL = async (blobId: string) => {

          const response = await fetch(`${aggregatorUrl}/v1/${blobId}`, {
              method: 'GET',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          const imgSrc = URL.createObjectURL(blob);
          setBlobUrl(imgSrc);
          console.log(imgSrc)
          
          return imgSrc;

    };

    // downloadBlobToURL("VDGIY3b9p4_afT308pBQ1VCVukoGghx0mrZSrbGztgk")

    return {
      downloadBlobToURL
    };
} 