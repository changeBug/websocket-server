import { Body, Controller, Post } from "@nestjs/common";
import { ChatRecordService } from "./chat-record.service";

@Controller('test')
export class TestController {
    constructor(
        private readonly chatRecordService: ChatRecordService
    ) {}

    @Post('')
    async test(
        @Body('userId') userId: number
    ) {
        console.log(111);
        
        return this.chatRecordService.findChatRecord(userId)
    }
}
