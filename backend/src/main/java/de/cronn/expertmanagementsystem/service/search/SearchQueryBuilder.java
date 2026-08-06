package de.cronn.expertmanagementsystem.service.search;

import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto;
import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto.OperatorEnum;
import de.cronn.expertmanagementsystem.model.ExpertSearchRequestDto.LogicalOperatorEnum;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SearchQueryBuilder {

    private static final String BASE_SQL = """
            SELECT u.*
            FROM users u
            JOIN user_skills u_skill ON u_skill.user_id = u.id
            JOIN domains d ON u_skill.domain_id = d.id
            JOIN expertise_levels e_level ON u_skill.expertise_level_id = e_level.id
            WHERE\s
            """;

    public SearchQuery buildQuery(List<ExpertSearchCriteriaDto> criteria, LogicalOperatorEnum logicalOperator) {
        String sql = buildSql(criteria, logicalOperator);
        Map<String, Object> parameters = buildParameters(criteria, logicalOperator);

        return new SearchQuery(sql, parameters);
    }

    private String buildSql(List<ExpertSearchCriteriaDto> criteria, LogicalOperatorEnum logicalOperator) {
        StringBuilder sql = new StringBuilder(BASE_SQL);
        List<String> clauses = new ArrayList<>();

        for (int i = 0; i < criteria.size(); i++) {
            ExpertSearchCriteriaDto crit = criteria.get(i);
            String operator = (crit.getOperator() == OperatorEnum.EQ) ? "=" : ">=";

            String clause = String.format(
                    "(LOWER(d.name) = LOWER(:domainName_%d) AND e_level.rank_value %s :rankValue_%d)",
                    i, operator, i
            );
            clauses.add(clause);
        }

        sql.append(String.join(" OR ", clauses));
        sql.append(" GROUP BY u.id ");

        if (logicalOperator == LogicalOperatorEnum.AND) {
            sql.append(" HAVING COUNT(DISTINCT d.id) = :criteriaCount ");
        }
        sql.append(" ORDER BY u.id ASC");
        return sql.toString();
    }

    private Map<String, Object> buildParameters(List<ExpertSearchCriteriaDto> criteria, LogicalOperatorEnum logicalOperator) {
        Map<String, Object> parameters = new HashMap<>();

        for (int i = 0; i < criteria.size(); i++) {
            ExpertSearchCriteriaDto crit = criteria.get(i);
            parameters.put("domainName_" + i, crit.getDomainName());
            parameters.put("rankValue_" + i, crit.getMinRankValue());
        }

        if (logicalOperator == LogicalOperatorEnum.AND) {
            parameters.put("criteriaCount", criteria.size());
        }

        return parameters;
    }
}