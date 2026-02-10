package com.devspark.summary;

class FakeSummaryProvider implements SummaryProvider {
    @Override
    public String summarize(String articleId) {
        return "summary for " + articleId;
    }
}
