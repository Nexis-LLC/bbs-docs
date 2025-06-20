import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/Vision">
                        Start Reading
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Home`}
            description="Comprehensive documentation for Bus Ticket Booking System">
            <HomepageHeader />
            <main>
                <section className={styles.section}>
                    <div className="container">
                        <div className="row">
                            <div className="col col--6">
                                <Heading as="h2" className={styles.sectionTitle}>About the Project</Heading>
                                <p>
                                    The Bus Ticket Booking System is a high-performance, scalable, and resilient platform designed to manage real-time bus ticket bookings. This documentation repository provides a comprehensive overview of the system's architecture, design decisions, and operational guidelines.
                                </p>
                                <p>
                                    We address challenges such as peak load failures, complex integrations, and limited observability by leveraging a modern tech stack: Java/Spring Boot, Kafka, and Kubernetes.
                                </p>
                            </div>
                            <div className="col col--6">
                                <Heading as="h2" className={styles.sectionTitle}>Key Features</Heading>
                                <ul>
                                    <li>Real-Time Seat Management: Accurate and up-to-the-second tracking of seat availability and prevention of overbooking.</li>
                                    <li>Resilient Payment Processing: Integration with secure payment gateways with robust transaction handling.</li>
                                    <li>Automated Scaling: Dynamic adjustment of resources using Kubernetes based on demand.</li>
                                    <li>Comprehensive Observability: Detailed monitoring and logging for proactive issue detection and system health analysis.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}