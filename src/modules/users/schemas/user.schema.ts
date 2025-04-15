import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/modules/auth/enums/roles.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ default: '' })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, default: [Role.USER] })
  roles: Role[];

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: Date.now })
  lastActive: Date;

  @Prop({ default: false })
  isOnline: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add compound index for email that only applies uniqueness when email is not empty
UserSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { email: { $ne: '' } },
    collation: { locale: 'en', strength: 2 },
  },
);

// Keep username as primary key with unique index
UserSchema.index(
  { username: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
  },
);
