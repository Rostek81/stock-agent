package pl.stockagent.model;

public record StockRecommendation(
        String symbol,
        double score,
        String decision,
        String explanation
) {
}
