package com.devspark.feed;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FeedController {
    @GetMapping("/articles")
    public ResponseEntity<ArticleListResponse> listArticles(@RequestParam(required = false) String sourceId) {
        return ResponseEntity.ok(new ArticleListResponse(List.of()));
    }
}
