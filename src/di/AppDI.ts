import { APP_CONSTS } from '@/common/consts';
import { APP_ENUMS } from '@/common/enums';
import { Utils } from '@/utils/Utils';

export class AppDI {
  urls = URLs;
  utils = Utils;
  enums = APP_ENUMS;
  consts = APP_CONSTS;
}

const URLs = {
  root: '/',
  documents: '/documents',
  pages: (documentId: string, pageId: string) =>
    `${URLs.documents}/${documentId}/pages/${pageId}`,
};
