export class UpdateModuleDto {
    readonly title?: string;
    readonly content?: string;
    readonly resources?: { contentType: string; resource: string }[];
    readonly difficulty_level?: string;
  }
  