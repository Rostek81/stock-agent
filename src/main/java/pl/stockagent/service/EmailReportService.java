package pl.stockagent.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import pl.stockagent.config.AgentProperties;
import pl.stockagent.model.StockRecommendation;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmailReportService {

    private final JavaMailSender mailSender;
    private final AgentProperties properties;

    public EmailReportService(JavaMailSender mailSender, AgentProperties properties) {
        this.mailSender = mailSender;
        this.properties = properties;
    }

    public void sendReport(List<StockRecommendation> recommendations) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(properties.reportRecipient());
        message.setSubject("NASDAQ daily report - " + LocalDate.now());
        message.setText(buildBody(recommendations));
        mailSender.send(message);
    }

    private String buildBody(List<StockRecommendation> recommendations) {
        StringBuilder builder = new StringBuilder();
        builder.append("Dzienny raport NASDAQ\n\n");

        recommendations.forEach(rec -> builder
                .append(rec.symbol())
                .append(" | decyzja: ")
                .append(rec.decision())
                .append(" | score: ")
                .append(rec.score())
                .append("\n")
                .append("Powód: ")
                .append(rec.explanation())
                .append("\n\n"));

        return builder.toString();
    }
}
