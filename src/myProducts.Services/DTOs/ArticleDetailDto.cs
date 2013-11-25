﻿
using System.Collections.Generic;

namespace MyProducts.Services.DTOs
{
    public class ArticleDetailDto : DtoBase
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public List<CategoryDto> Categories { get; set; }
    }
}