import {
  Ref,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import { UserClass } from './user';

@modelOptions({
  schemaOptions: { collection: 'posts', timestamps: true },
})
@pre<PostClass>(new RegExp('find'), function () {
  // nested property 'job.title'
  this.populate({
    path: 'author',
    select: 'username email job.title',
  });
})
@pre<PostClass>('save', function () {
  this.title = this.title.toUpperCase();
})
class PostClass {
  @prop({ required: true })
  title: string;

  @prop()
  content?: string;

  // This is type is the javascript type
  @prop({ type: () => [String] })
  tags?: ('blog' | 'content')[];

  @prop({ required: true, ref: () => UserClass })
  author: Ref<UserClass>;
}

const Post = getModelForClass(PostClass);

export { PostClass, Post };
