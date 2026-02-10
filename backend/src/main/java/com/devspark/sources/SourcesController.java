package com.devspark.sources;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/sources")
public class SourcesController {
    @PostMapping("/import-opml")
    public ResponseEntity<ImportResult> importOpml(@org.springframework.web.bind.annotation.RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new ImportResult(1));
    }
}
