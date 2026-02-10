package com.devspark.summary;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SummaryJobTest {
    @Test
    void summaryJobUpdatesStatusAndText() {
        SummaryJob job = new SummaryJob(new FakeSummaryProvider());
        SummaryArticle article = new SummaryArticle("article-1", SummaryStatus.PENDING, null);

        SummaryArticle updated = job.summarize(article);

        assertThat(updated.status()).isEqualTo(SummaryStatus.SUCCEEDED);
        assertThat(updated.summaryText()).isEqualTo("summary for article-1");
    }
}
