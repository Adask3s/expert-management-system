package de.cronn.expertmanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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

    public ExpertiseLevel() {
    }

}