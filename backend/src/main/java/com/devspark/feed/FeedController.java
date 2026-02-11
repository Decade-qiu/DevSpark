package com.devspark.feed;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.devspark.ingestion.ArticleRecord;

@RestController
@RequestMapping("/api")
public class FeedController {
    
    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("/articles")
    public ResponseEntity<ArticleListResponse> listArticles(@RequestParam(required = false) String sourceId) {
        List<ArticleSummary> summaries = feedService.getRecentArticles().stream()
            .map(record -> new ArticleSummary(
                record.link(), // Use link as ID for now
                record.title(),
                record.summary(),
                record.source(),
                record.publishedDate() != null ? record.publishedDate().toString() : "",
                record.content(),
                record.imageUrl()
            ))
            .collect(java.util.stream.Collectors.toList());
            
        return ResponseEntity.ok(new ArticleListResponse(summaries));
    }
}
