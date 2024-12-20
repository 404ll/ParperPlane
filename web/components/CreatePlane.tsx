'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useForm, FormProvider } from "react-hook-form"; 
import { useBetterSignAndExecuteTransaction } from '@/hooks/useBetterTx';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { createAirplane } from '@/contracts/paperairplane';
import { useState } from 'react'
import { isValidSuiAddress } from '@mysten/sui/utils';
import { useUploadBlob } from "@/hooks/useUploadBlob"
import { toast } from "@/hooks/use-toast"

interface CreatePlaneProps {
  disabled?: boolean; // 可选属性
}

export function CreatePlaneDialog({disabled }: CreatePlaneProps) {
  const form = useForm();
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const account = useCurrentAccount();
  const { storeBlob } = useUploadBlob();
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<File | null>(null); 

  const { handleSignAndExecuteTransaction} = useBetterSignAndExecuteTransaction({
    tx: createAirplane,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your paper plane has been launched successfully!",
        duration: 3000,
      })
    },
    onSettled: () => {
      //refresh data
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleImageClear = () => {
    setImage(null); // 清除图片
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!account || !isValidSuiAddress(account.address)) return

    setIsUploading(true)
    try {
      let blobId = null
      if (image) {
        const blobInfo = await storeBlob(image)
        console.log(blobInfo)
        blobId = blobInfo.blobId
      }

      await handleSignAndExecuteTransaction({
        name: name,
        content: content,
        blobs: blobId ? [blobId] : []
      })

      setName("")
      setContent("")
      setImage(null)
    } catch (error) {
      console.error('Create airplane failed:', error)
      toast({
        title: "Error",
        description: "Failed to launch your paper plane. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="font-['DynaPuff'] w-fit px-[40px]">
          Create Paper Plane
        </Button>
      </DialogTrigger> 

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle style={{fontFamily: 'DynaPuff'}}> Write down your thoughts...</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={() => (
                <FormItem>
                  <FormLabel style={{fontFamily: 'DynaPuff'}}>Plane Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter plane name"
                      className="bg-white"
                      style={{fontFamily: 'DynaPuff'}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel style={{fontFamily: 'DynaPuff'}}>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setContent(e.target.value)
                      }
                      placeholder="Enter your thoughts"
                      className="bg-white min-h-[100px]"
                      style={{fontFamily: 'DynaPuff'}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 图片处理 */}
            <div className="pt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="picture-upload"
              />
              <label htmlFor="picture-upload">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full dyna-puff-font"
                  onClick={() => document.getElementById("picture-upload")?.click()}
                >
                  {image ? 'Change Picture' : 'Upload Picture'}
                </Button>
              </label>
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{image.name}</p>
                  <Button
                    type="button"
                    variant="destructive"
                    className="mt-1 text-sm"
                    onClick={handleImageClear}
                  >
                    Clear Picture
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="dyna-puff-font flex items-center bg-[#F0F1F5] text-black" 
                style={{fontFamily: 'DynaPuff'}}
                disabled={isUploading}
              >
                <Image src="/logo/launch.png" alt="Sui Logo" width={20} height={20} />
                {isUploading ? 'Launching...' : 'Launch'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
