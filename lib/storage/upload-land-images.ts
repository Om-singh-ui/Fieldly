import { supabaseAdmin, LAND_BUCKET } from "./supabase-server"
import { v4 as uuid } from "uuid"

export async function uploadLandImages(
  files: File[],
  listingId: string
) {
  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split(".").pop()
    const path = `${listingId}/${uuid()}.${ext}`

    const { error } = await supabaseAdmin.storage
      .from(LAND_BUCKET)
      .upload(path, file)

    if (error) throw new Error(error.message)

    const { data } = supabaseAdmin.storage
      .from(LAND_BUCKET)
      .getPublicUrl(path)

    urls.push(data.publicUrl)
  }

  return urls
}