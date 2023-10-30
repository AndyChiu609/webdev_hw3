import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { commentTable } from "@/db/schema";
// 若有其他需要從 "drizzle-orm" 導入的模組，請自行加入

const postCommentRequestSchema = z.object({
    userName: z.string().min(1).max(50),
    comment: z.string().min(1).max(100),
    activityId: z.number().int(),
});

type PostCommentRequest = z.infer<typeof postCommentRequestSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log("收到的數據:", data);
  
    let parsedData: PostCommentRequest;
    try {
      console.log("開始parse");
      parsedData = postCommentRequestSchema.parse(data);
    } catch (error) {
      console.error("Zod解析錯誤:", error);
      return NextResponse.json({ error: `無效的請求，有跑到後端` }, { status: 400 });
    }
  
    const { userName, comment, activityId } = data as PostCommentRequest;

    try {
      await db
        .insert(commentTable)
        .values({
            userName,
            comment,
            activityId,
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
    let comments;

    try {
        comments = await db.select().from(commentTable);
        
        // 新增 log 以顯示從數據庫取得的留言資料
        console.log("從數據庫取得的留言資料:", comments);

        return NextResponse.json(comments, { status: 200 });

    } catch (error) {
        console.error("數據庫查詢錯誤:", error);
        return NextResponse.json(
            { error: "查詢數據時出現問題" },
            { status: 500 }
        );
    }
}