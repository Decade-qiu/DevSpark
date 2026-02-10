package com.devspark.summary;

public class SummaryJob {
    private final SummaryProvider provider;

    public SummaryJob(SummaryProvider provider) {
        this.provider = provider;
    }

    public SummaryArticle summarize(SummaryArticle article) {
        String summary = provider.summarize(article.id());
        return article.withSummary(summary);
    }
}
