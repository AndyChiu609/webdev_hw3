import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { activityTable } from "@/db/schema";

const postActivityRequestSchema = z.object({
    from: z.string(),
    to: z.string(),
    activityName: z.string().min(1).max(50),
  });

type PostActivityRequest = z.infer<typeof postActivityRequestSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log("收到的數據:", data);
  
    let parsedData: PostActivityRequest;
    try {
      console.log("開始parse");
      parsedData = postActivityRequestSchema.parse(data);
    } catch (error) {
      console.error("Zod解析錯誤:", error);
      return NextResponse.json({ error: `無效的請求，有跑到後端` }, { status: 400 });
    }
  
    const { from, to, activityName } = data as PostActivityRequest;

    // 轉換字符串到Date類型
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    try {
      await db
        .insert(activityTable)
        .values({
            from: fromDate,
            to: toDate,
            activityName,
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
    let activities;

    try {
        activities = await db.select().from(activityTable);

        return NextResponse.json(activities, { status: 200 });

    } catch (error) {
        console.error("數據庫查詢錯誤:", error);
        return NextResponse.json(
            { error: "查詢數據時出現問題" },
            { status: 500 }
        );
    }
}
  
