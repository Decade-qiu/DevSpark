package com.devspark.summary;

public record SummaryArticle(String id, SummaryStatus status, String summaryText) {
    SummaryArticle withSummary(String summary) {
        return new SummaryArticle(id, SummaryStatus.SUCCEEDED, summary);
    }
}
