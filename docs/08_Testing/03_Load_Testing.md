# Load Testing: Apache JMeter with Java Spring Boot

This document outlines how to implement **load testing** for a Java Spring Boot backend using **Apache JMeter** — the most widely adopted open-source load testing tool for JVM-based applications.

---

## 1. Why JMeter?

- Written in Java — native to Spring Boot ecosystem.
- Rich GUI and CLI support.
- Supports REST, SOAP, WebSockets, JDBC, JMS, etc.
- Integration with Maven and CI/CD pipelines.
- Extensive reporting capabilities.

---

## 2. Installation

### Via Homebrew (macOS):

```bash
brew install jmeter
```

### Manual Download:

1. Download from: https://jmeter.apache.org/download_jmeter.cgi
2. Unzip and add `bin/` to your system PATH.

---

## 3. Project Setup (Recommended Structure)

```
load-tests/
├── test-plans/
│   └── booking-flow.jmx
├── results/
├── scripts/
│   └── prepare-db.sh
└── README.md
```

---

## 4. Writing a Test Plan

Create test scenarios using the **JMeter GUI** (`jmeter` command), then export the `.jmx` plan.

Example use cases:

- Booking a seat (`POST /api/bookings`)
- Fetching available routes (`GET /api/routes`)
- Login (`POST /api/auth/login`)

---

## 5. CLI Execution

```bash
jmeter -n -t test-plans/booking-flow.jmx -l results/results.jtl -e -o results/report
```

- `-n`: Non-GUI mode
- `-t`: Test plan file
- `-l`: Log results
- `-e -o`: Generate HTML report in output folder

---

## 6. Integration with Maven

Add the plugin:

```xml
<plugin>
  <groupId>com.lazerycode.jmeter</groupId>
  <artifactId>jmeter-maven-plugin</artifactId>
  <version>3.4.0</version>
  <executions>
    <execution>
      <goals>
        <goal>jmeter</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

Run tests via:

```bash
mvn verify
```

---

## 7. Best Practices

- Use CSV DataSet for dynamic data (e.g., credentials).
- Add assertions to validate response codes and content.
- Separate load vs stress vs endurance test plans.
- Clean and reset DB with scripts before each run (for consistency).
- Run with `-Xms2G -Xmx4G` JVM args for heavy loads.

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets
