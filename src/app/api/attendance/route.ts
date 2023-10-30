import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { attendanceTable } from "@/db/schema";
import {eq, and, sql} from "drizzle-orm"

const postAttendanceRequestSchema = z.object({
    userName: z.string().min(1).max(50),
    activityName: z.string().min(1).max(50),
    signStatus: z.enum(["in", "out"]),
});

type PostAttendanceRequest = z.infer<typeof postAttendanceRequestSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log("收到的數據:", data);
  
    let parsedData: PostAttendanceRequest;
    try {
      console.log("開始parse");
      parsedData = postAttendanceRequestSchema.parse(data);
    } catch (error) {
      console.error("Zod解析錯誤:", error);
      return NextResponse.json({ error: `無效的請求，有跑到後端` }, { status: 400 });
    }
  
    const { userName, activityName, signStatus } = data as PostAttendanceRequest;

    try {
      await db
        .insert(attendanceTable)
        .values({
            userName,
            activityName,
            signStatus,
            // 其他需要的欄位，如createdAt，將自動使用其默認值（如已在模式中定義）
        })
        .execute();
    } catch (error) {
      console.error("數據庫插入錯誤:", error);
      return NextResponse.json(
        { error: "出現問題" },
        { status: 500 },
      );
    }
  
    return NextResponse.json({ message: "OK" }, { status: 200 });
}

export async function GET(request: NextRequest) {
    let attendanceData;

    try {
        attendanceData = await db.select().from(attendanceTable);
        console.log(attendanceData);
        return NextResponse.json(attendanceData, { status: 200 });

    } catch (error) {
        console.error("數據庫查詢錯誤:", error);
        return NextResponse.json(
            { error: "查詢數據時出現問題" },
            { status: 500 }
        );
    }
}


export async function PUT(request: NextRequest) {
  const data = await request.json();
  console.log("收到的數據:", data);

  let parsedData: PostAttendanceRequest;
  try {
    console.log("開始parse");
    parsedData = postAttendanceRequestSchema.parse(data);
  } catch (error) {
    console.error("Zod解析錯誤:", error);
    return NextResponse.json({ error: `無效的請求，有跑到後端` }, { status: 400 });
  }

  const { userName, activityName, signStatus } = data as PostAttendanceRequest;

  try {
    await db
      .update(attendanceTable)
      .set({
          signStatus,
      }).where(
        and(
          eq(attendanceTable.userName, userName),
          eq(attendanceTable.activityName, activityName)
        )
      ).execute();
  
  } catch (error) {
    console.error("數據庫插入錯誤:", error);
    return NextResponse.json(
      { error: "出現問題" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}

