import type {components} from './api';

// Typy modeli użytkownika
export type UserListItem = components['schemas']['UserListItem'];
export type UserSkillDetail = components['schemas']['UserSkillDetail'];
export type UserListPage = components['schemas']['UserListPage'];
// Model bazowa z OpenAPI, który jest używany w walidacji formularza dodawania użytkownika
export type User = components['schemas']['User'];

// Typy filtrowania i wyszukiwania
export type ExpertSearchCriteria = components['schemas']['ExpertSearchCriteria'];
export type ExpertSearchRequest = components['schemas']['ExpertSearchRequest'];

// Słowniki
export type Domain = components['schemas']['Domain'];
export type DomainPageDto = components['schemas']['DomainPageDto'];
export type DomainRequest = components['schemas']['DomainRequest'];
export type ExpertiseLevel = components['schemas']['ExpertiseLevel'];

// Pomocnicze unie wyliczeniowe dla interfejsu UI
export type SearchOperator = 'EQ' | 'GTE';
export type LogicalOperator = 'AND' | 'OR';