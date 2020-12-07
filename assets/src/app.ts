import {errorHandler, NotFoundError, serverApp} from '@ranjodhbirkaur/common';
import {assetsRoutes} from './routes';
import fileUpload from "express-fileupload";

serverApp.use(assetsRoutes);

serverApp.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 },
}));

serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
