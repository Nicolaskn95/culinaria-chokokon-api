import { PipelineStage } from "npm:mongoose@7";

/***
    request.query > sort = updatedAt:desc
    request.query > sort = name:asc
    request.query > sort = name:desc

    const [field, order] = sort.split(':');
      aggregate.push({
        $sort: {
          [field]: order === 'desc' ? -1 : 1
        }
      });
    } else {
      // Default Sort
      aggregate.push({
        $sort: {
          createdAt: -1
        }
      });
 */

class Piper {
  static $sort(sort: string): PipelineStage {
    if (!sort) {
      return {
        $sort: {
          createdAt: -1,
        },
      };
    }

    const [field, order] = sort.split(":");
    return {
      $sort: {
        [field]: order === "desc" ? -1 : 1,
      },
    };
  }
}

export { Piper };
