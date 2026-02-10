package com.devspark.drafts;

public class DraftExportService {
    public ExportResponse export(Draft draft) {
        String content = "# " + draft.title() + "\n\n" + draft.body()
            + "\n\n[source](" + draft.sourceUrl() + ")\n";
        return new ExportResponse(content);
    }
}
