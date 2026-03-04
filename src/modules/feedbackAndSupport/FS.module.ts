import { Module } from "@nestjs/common";
import { FSController } from "./controller/FS.controller";
import { FSService } from "./service/FS.service";

@Module({
    controllers:[FSController],
    providers:[FSService]
})

export class FSModule {}