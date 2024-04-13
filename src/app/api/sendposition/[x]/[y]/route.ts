import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"


const prisma = new PrismaClient()
export async function POST(req: Request, context: any) {
    const { params } = context
    const dataIn = await req.json()
    const position = await prisma.position.create({
        data: {
            userId : dataIn.userId,
            missionId: dataIn.missionId,
            x: +params.x,
            y: +params.y
        }
    })

    const positions = await prisma.position.findMany({
        where: {
            mission: { id: dataIn.missionId }
        }
    })

    const users = await prisma.user.findMany({
        where: {
            position: {
                some: {
                    missionId: dataIn.missionId
                }
            }
        }
    })

    return NextResponse.json({status: "ok" , positions : positions, users: users})
}