package pl.stockagent.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DailyStockAgentScheduler {

    private static final Logger log = LoggerFactory.getLogger(DailyStockAgentScheduler.class);

    private final MarketAnalysisService marketAnalysisService;
    private final EmailReportService emailReportService;

    public DailyStockAgentScheduler(MarketAnalysisService marketAnalysisService,
                                    EmailReportService emailReportService) {
        this.marketAnalysisService = marketAnalysisService;
        this.emailReportService = emailReportService;
    }

    @Scheduled(cron = "${agent.cron:0 0 14 * * MON-FRI}", zone = "${agent.time-zone:Europe/Warsaw}")
    public void runDailyReport() {
        log.info("Uruchamiam dzienną analizę NASDAQ");
        var recommendations = marketAnalysisService.analyze();
        emailReportService.sendReport(recommendations);
        log.info("Raport wysłany na e-mail");
    }
}
