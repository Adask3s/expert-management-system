package de.cronn.expertmanagementsystem.service.search;

import java.util.Map;

public record SearchQuery(
        String sql,
        Map<String, Object> parameters
) {
}