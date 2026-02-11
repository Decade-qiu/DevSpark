package com.devspark.sources;

import com.devspark.feed.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sources")
public class SourcesController {

    private final FeedService feedService;

    public SourcesController(FeedService feedService) {
        this.feedService = feedService;
    }

    @PostMapping("/import-opml")
    public ResponseEntity<ImportResult> importOpml(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new ImportResult(1));
    }

    /** Validate an RSS feed URL. */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateSource(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "error", "URL is required"));
        }

        String feedTitle = feedService.validateSource(url);
        if (feedTitle != null) {
            return ResponseEntity.ok(Map.of("valid", true, "title", feedTitle));
        } else {
            return ResponseEntity.ok(Map.of("valid", false, "error", "Could not find a valid RSS or Atom feed at this URL"));
        }
    }

    /** Add a custom RSS source. */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addSource(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        String name = body.get("name");

        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "URL is required"));
        }

        String sourceName = feedService.addSource(name, url);
        if (sourceName != null) {
            return ResponseEntity.ok(Map.of("success", true, "name", sourceName));
        } else {
            return ResponseEntity.ok(Map.of("success", false, "error", "Invalid RSS feed URL"));
        }
    }

    /** Remove a custom source. */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> removeSource(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Source name is required"));
        }

        boolean removed = feedService.removeSource(name);
        return ResponseEntity.ok(Map.of("success", removed));
    }

    /** List custom sources. */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listSources() {
        return ResponseEntity.ok(Map.of("sources", feedService.listCustomSources()));
    }
}
