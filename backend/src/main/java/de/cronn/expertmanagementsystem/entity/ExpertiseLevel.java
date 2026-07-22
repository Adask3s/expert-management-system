package de.cronn.expertmanagementsystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "expertise_levels")
public class ExpertiseLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "rank_value", nullable = false)
    private Integer rankValue;

    public ExpertiseLevel() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getRankValue() { return rankValue; }
    public void setRankValue(Integer rankValue) { this.rankValue = rankValue; }
}