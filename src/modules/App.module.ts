import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/Auth.module.js";

@Module({
	imports: [AuthModule],
})
export class AppModule {}
