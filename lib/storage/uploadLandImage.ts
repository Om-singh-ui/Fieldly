import { supabase, LAND_BUCKET } from "@/lib/supabase/server"
import { v4 as uuid } from "uuid"

export async function uploadLandImage(file: File, listingId: string) {
  const ext = file.name.split(".").pop()
  const filePath = `${listingId}/${uuid()}.${ext}`

  const { error } = await supabase.storage
    .from(LAND_BUCKET)
    .upload(filePath, file)

  if (error) throw new Error("Image upload failed")

  const { data } = supabase.storage
    .from(LAND_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}