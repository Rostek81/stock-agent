package pl.stockagent.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.util.List;

@Validated
@ConfigurationProperties(prefix = "agent")
public record AgentProperties(
        @NotEmpty List<@NotBlank String> symbols,
        @NotBlank String reportRecipient,
        BigDecimal minDailyVolume,
        int analysisLookbackDays,
        double minScoreToRecommend
) {
    public AgentProperties {
        minDailyVolume = minDailyVolume == null ? BigDecimal.valueOf(1_000_000) : minDailyVolume;
        analysisLookbackDays = analysisLookbackDays <= 0 ? 30 : analysisLookbackDays;
        minScoreToRecommend = minScoreToRecommend <= 0 ? 2.0 : minScoreToRecommend;
    }
}
