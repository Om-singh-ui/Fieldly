import { NextResponse } from "next/server";
import { getLandownerProfileData } from "@/lib/queries/getLandownerProfileData";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getLandownerProfileData(params.id);

    if (!data) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PROFILE API ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}