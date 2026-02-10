package com.devspark.drafts;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DraftExportTest {
    @Test
    void exportReturnsMarkdownWithCitations() {
        DraftExportService service = new DraftExportService();
        Draft draft = new Draft("draft-1", "Hello", "Body", "https://example.com/post-1");

        ExportResponse response = service.export(draft);

        assertThat(response.contentMd()).contains("[source](https://example.com/post-1)");
    }
}
