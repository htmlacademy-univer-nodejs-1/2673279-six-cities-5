import { defaultClasses, modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 1024
  })
  public text!: string;

  @prop({ required: true })
  public offerId!: string;

  @prop({ required: true })
  public userId!: string;

  @prop({
    required: true,
    min: 1,
    max: 5
  })
  public rating!: number;
}

export const CommentModel = getModelForClass(CommentEntity);
