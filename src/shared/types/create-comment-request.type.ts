import { Request } from 'express';
import { RequestBody, RequestParams } from '../libs/rest/index.js';
import { CreateCommentDto } from '../../shared/modules/comment/index.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDto>;
