# Agent Updates Summary

**Date:** February 19, 2026
**Purpose:** Incorporate DER-R repository knowledge base documentation into agent specifications

---

## Overview

All agents in the `.github/agents/` folder have been updated to incorporate domain-specific knowledge from the DER-R repository's knowledge base, including:

- `code_style_and_setup_guide.md` - Repository coding standards and project structure
- `derR_package_usage_guide.md` - derR package functions and adoption patterns
- `derR_lightcast_api_guide.md` - Lightcast API integration via derR
- `derR_visualization_functions_guide.md` - Chart creation and theming standards

---

## Agent Updates by File

### 1. SpecAgent (`01-spec-agent.md`)
**Updates:**
- Added DER context to mission statement
- Incorporated standard DER project elements in specification template:
  - Data sources (BLS, Census, Lightcast, FRED)
  - Geographic scope and WDA considerations
  - derR package usage planning
  - Output format specifications
- Added DER-specific edge cases:
  - Survey weights, PUMA boundary changes, NAICS/SOC version handling
  - Seasonal adjustment, inflation adjustment
  - API rate limits, large dataset considerations
- Enhanced non-functional requirements with DER standards:
  - Reproducibility (no absolute paths, `here::here()`)
  - Style (tidyverse, native pipe `|>`)
  - Branding (der_theme(), DER color palettes)
  - Security (API credentials via environment variables)

### 2. Architect (`02-architect.md`)
**Updates:**
- Enhanced mission with DER project architecture focus
- Added comprehensive DER project structure template:
  - Standard folders: `data/`, `code/`, `output/`, `reports/`
  - `.Rproj` file, `load_libraries.R`, README.md
- Documented three common DER pipeline patterns:
  1. API Data Pipeline (Lightcast/Census/BLS)
  2. Survey Data Pipeline (IPUMS/PUMS with weights)
  3. Multi-Source Integration
- Added derR package dependency documentation:
  - Visualizations, Lightcast API, crosswalks, utilities
- Created reproducibility checklist specific to DER projects

### 3. Planner (`03-planner.md`)
**Updates:**
- Added DER project context to mission
- Documented standard DER project structure tasks
- Identified common task dependencies:
  - Lightcast API authentication before data calls
  - Geographic joins before WDA aggregation
  - Data processing before visualization
- Added derR package considerations for task planning
- Defined DER-specific risk flags:
  - `security`: API credentials, PII handling
  - `perf`: Large PUMS datasets, complex joins
  - `data-quality`: Survey weights, seasonal adjustment

### 4. Coder (`04-coder.md`)
**Updates:**
- Enhanced mission with DER-specific implementation requirements
- Added derR package usage to core workflow:
  - `library(derR)` inclusion
  - Visualization functions, themes, color palettes
  - Lightcast API access
  - Built-in crosswalks
- Expanded implementation checklist with derR-specific items:
  - Native pipe `|>` preference
  - derR color palettes and themes
  - Lightcast API credential handling
  - Crosswalk usage verification
- Added three new sections:
  - DER Visualization Standards
  - Lightcast API Usage
  - Geographic and Industry Crosswalks

### 5. Reviewer (`05-reviewer.md`)
**Updates:**
- Enhanced mission with DER repository standards
- Expanded review checklist with derR-specific checks:
  - derR package usage verification
  - Chart function usage
  - Theme application
  - Color palette compliance
  - Crosswalk usage instead of recreation
  - Lightcast API proper access
- Added visualization quality checks:
  - Titles, labels, source citations
  - Recession bars for economic time series
  - Consistent dimensions via `save_der_plot()`
- Enhanced API credential security checks

### 6. QA (`06-qa.md`)
**Updates:**
- Added DER research project context to mission
- Expanded mandatory checks with DER-specific validations:
  - No absolute paths
  - Data validation (columns, NAs, survey weights, geographic totals)
  - derR visualization rendering
  - API error handling
- Enhanced test categories:
  - derR function usage tests
  - Crosswalk join tests
  - Survey weight calculation tests
  - Reproducibility tests (clean environment, `renv::restore()`)

### 7. Privacy (`07-privacy.md`)
**Updates:**
- Enhanced mission with DER survey data privacy focus
- Expanded PII checks for survey microdata:
  - PUMS/CPS individual identifiers
  - Sub-PUMA geography
  - Individual earnings/income
- Added survey data privacy section:
  - IPUMS usage agreements
  - No public individual-level data
  - Survey weight requirements
- Detailed API credential security for all DER APIs:
  - Lightcast, Census, BLS, FRED
  - `.Renviron` requirements
- Added three DER-specific privacy standards sections:
  - Small Cell Suppression (10 obs minimum)
  - Geographic Disclosure rules
  - Survey Microdata handling
  - API Credentials Security

### 8. Integrator (`08-integrator.md`)
**Updates:**
- Added DER project context to mission
- Expanded integration checks with DER-specific validations:
  - derR package installation and loading
  - derR visualization function availability
  - derR crosswalk accessibility
  - Lightcast API authentication (if applicable)
  - Chart rendering with themes
  - Output file locations
- Added environment validation:
  - API keys present (without exposure)
  - No absolute paths
  - `here::here()` resolution

### 9. Docs (`09-docs.md`)
**Updates:**
- Enhanced mission with DER documentation standards
- Completely rewrote README template with DER-specific sections:
  - Purpose and research question
  - Data sources with API links and series IDs
  - Required packages (derR emphasis)
  - Setup instructions (API keys, `renv`)
  - Quickstart with full reproduction steps
  - Project structure
  - Key outputs
  - Methodology notes
  - derR package usage documentation
  - Troubleshooting
- Added DER-specific documentation standards:
  - roxygen2 patterns for derR contributions
  - Quarto report structure
  - Data source documentation requirements

### 10. Visualizer (`10-visualizer.md`)
**Updates:**
- Enhanced mission with DER branding and derR standards
- Added derR chart function preferences:
  - `create_line_chart()`, `create_bar_chart()`, etc.
  - `der_theme()` application
  - DER color palette usage
- Added comprehensive DER Chart Function Reference table
- Documented `der_theme()` configuration options:
  - Axis parameters
  - Grid parameters
  - Common configurations
- Added DER color palette usage section:
  - Categorical data (der_category)
  - Sequential data (der_sequential_*)
  - Color codes
- Added economic data specific guidance:
  - Recession shading
  - Large number formatting
  - Source citations

### 11. Researcher (`11-researcher.md`)
**Updates:**
- Enhanced mission with DER data ecosystem
- Expanded package selection recommendations:
  - derR for Lightcast, crosswalks, visualizations
  - Census data: tidycensus, ipumsr
  - BLS: BLSloadR
  - FRED: fredr
  - Data formats: arrow/parquet, readxl/writexl
- Enhanced research template with DER-specific sections:
  - API endpoints for all DER sources
  - derR function recommendations
  - Survey methodology considerations
  - DER repository patterns review
- Added three new sections:
  - Check Existing DER-R Projects
  - Common DER Data Patterns
  - Reproducibility Standards

---

## Key Themes Across All Updates

### 1. derR Package Integration
Every agent now understands:
- When to use derR functions vs. alternatives
- How to apply derR themes and color palettes
- Which derR crosswalks are available
- How to access Lightcast API via derR

### 2. Reproducibility Standards
Consistent enforcement of:
- No absolute paths (use `here::here()`)
- API credentials via `.Renviron` only
- `set.seed()` for stochastic processes
- Native pipe `|>` preference
- `renv` for dependency management

### 3. Data Privacy & Security
Clear understanding of:
- Survey microdata handling (PUMS/CPS)
- Small cell suppression (10 obs minimum)
- Geographic disclosure rules (PUMA/WDA level)
- API credential security across all sources

### 4. DER Branding & Quality
Consistent application of:
- `der_theme()` to all visualizations
- DER color palettes (categorical and sequential)
- Chart titles, labels, source citations
- Recession bars for economic time series
- `save_der_plot()` for consistent dimensions

### 5. Common DER Data Patterns
Recognition of:
- Geographic aggregation (PUMA→WDA via derR crosswalks)
- Industry analysis (NAICS hierarchies and crosswalks)
- Occupation analysis (SOC hierarchies and crosswalks)
- Race/ethnicity categorization (derR labels)
- Job postings analysis (Lightcast API via derR)

---

## Impact on Workflow

### For New Projects
Agents now automatically consider:
1. Standard DER project structure
2. derR package capabilities and usage
3. Common DER data workflows
4. Repository coding standards
5. Privacy and disclosure requirements

### For Code Quality
Agents now enforce:
1. tidyverse style with native pipe
2. derR visualization standards
3. Proper API credential handling
4. Reproducible path management
5. Survey data privacy rules

### For Documentation
Agents now produce:
1. DER-compliant README files
2. Proper roxygen2 for derR contributions
3. Complete data source documentation
4. Reproducibility instructions
5. Methodology transparency

---

## Files Modified

All agent specification files have been updated:

1. `01-spec-agent.md` ✓
2. `02-architect.md` ✓
3. `03-planner.md` ✓
4. `04-coder.md` ✓
5. `05-reviewer.md` ✓
6. `06-qa.md` ✓
7. `07-privacy.md` ✓
8. `08-integrator.md` ✓
9. `09-docs.md` ✓
10. `10-visualizer.md` ✓
11. `11-researcher.md` ✓

**Note:** `00-orchestrator.md`, `CONTRACT.md`, `DISPATCH-REFERENCE.md`, and `WORKFLOW.md` were not modified as they define the agent framework itself, not domain-specific behavior.

---

## Backward Compatibility

All updates are **additive** and maintain backward compatibility:
- Existing workflows continue to function
- Additional context enhances but doesn't restrict agent behavior
- Agents can still handle non-DER R projects (though optimized for DER patterns)
- General R/Quarto best practices are preserved

---

## Verification

To verify updates are working:
1. Agents should now mention derR package in relevant contexts
2. Visualization tasks should reference `der_theme()` and color palettes
3. Privacy checks should include survey data and API credentials
4. Architecture designs should follow DER project structure
5. Documentation should include DER-specific sections

---

## Next Steps

1. **Test Agent Behavior**: Run orchestrator on a new project to verify agents use DER knowledge
2. **Monitor Agent Output**: Check that agents reference derR functions and DER patterns appropriately
3. **Iterate on Documentation**: Update knowledge base as new patterns emerge
4. **Agent Refinement**: Further tune agents based on actual usage in DER projects

---

**End of Summary**
