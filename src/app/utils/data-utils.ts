import { Paginate } from "../core/models/picture";

export class DataUtils {

  static pagination(page: Paginate): { offset: number; limit: number } {
    const offset = page.pageIndex * page.pageSize;
    return {offset: offset, limit: page.pageSize};
  }
}
