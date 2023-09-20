import * as crypto from "crypto";
import * as md5 from "md5";
import { writeFileSync, existsSync, mkdirSync } from "fs";


export const sha256 = (str: string): string => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

export const saveFile = async (file: Buffer, fileType: string, userId: number) => {
    // 签名
    const sign = md5(file);
    const filePath = process.env.NODE === 'development'
      ? '/Volumes/工作数据/tempNew/chat-assets'
      : '/usr/local/download';
    const BASE_URL = process.env.NODE === 'development' ? 'http://localhost:3100' : 'http:///139.224.250.252/download';
    if (!existsSync(filePath)) {
        mkdirSync(filePath);
    }
    if (!existsSync(filePath + '/' + userId)) {
        mkdirSync(filePath + '/' + userId);
    }
    if (existsSync(`${filePath}/${userId}/${sign}.${fileType}`)) {
        return `${BASE_URL}/${userId}/${sign}.${fileType}`;
    } else {
        writeFileSync(`${filePath}/${userId}/${sign}.${fileType}`, file);
        return `${BASE_URL}/${userId}/${sign}.${fileType}`;
    }
}