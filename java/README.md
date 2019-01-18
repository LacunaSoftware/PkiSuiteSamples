# PKI Suite samples for Java

This folder contains **Java sample projects** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

Default sample
--------------

A sample for a Java web application using the Spring Boot framework can be found in the folder
[springmvc](springmvc/). The sample uses spring boot to provide a self-contained web application,
not requiring a web server installed. The only requirement is **having a JDK installed**.

To run, you can use the following tools:

**Using Gradle**

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip)
   or clone the repository
   
1. In a command prompt, navigate to the folder `springmvc` and run the command
   `gradlew bootRun` (on Linux `./gradlew bootRun`). If you are using Windows, you can alternatively
   double-click the file `Run-Sample.bat`.
  
1. Once you see the message "Started Application in x.xxx seconds" (the on-screen percentage
   will *not* reach 100%), open a web browser and go the URL http://localhost:60695
   
> If you are on Linux, you may have to add the execution permission to *gradrew* file by executing
the command `chmod +x gradlew`.

**Using Maven**

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip)
   or clone the repository

1. In a command prompt, navigate to the folder `springmvc` and run the command
   `mvn spring-boot:run`. To run this command, it's necessary to have the Apache Maven installed.
   
1. Once you see the message "Started Application in x.xxx seconds", open a web browser and go the URL
   http://localhost:60695

Opening the samples on Eclipse or IDEA
--------------------------------------

To open one of the samples on Eclipse, run `gradlew eclipse` on the sample's folder and then
then import the project from Eclipse.

To open one of the samples on IntelliJ IDEA, run `gradlew idea` on the sample's folder
and then use the "Open" funcionality inside IDEA (works better than "Import").

REST PKI's client lib
---------------------

The samples use a client lib which encapsulates the API calls to REST PKI. This library
supports **Java 7 or greater**. The lib should be **referenced as a dependency**, as can
be seen in the file [build.gradle](springmvc/build.gradle) of each sample:

	repositories {
		mavenCentral()
		maven {
			url  "http://dl.bintray.com/lacunasoftware/maven" 
		}
	} 

	dependencies {
		compile("com.lacunasoftware.restpki:restpki-client:1.10.2")
	}

If you project uses Maven, please refer to the file [pom.xml](springmvc/pom.xml) instead:

	<dependencies>
		...
		<dependency>
			<groupId>com.lacunasoftware.restpki</groupId>
			<artifactId>restpki-client</artifactId>
			<version>1.10.2</version>
		</dependency>
		...
	</dependencies>
	...
	<repositories>
		<repository>
			<id>lacuna.repository</id>
			<name>lacuna repository</name>
			<url>http://dl.bintray.com/lacunasoftware/maven</url>
		</repository>
	</repositories>

If your project uses another tool for dependency resolution (e.g. Ivy), please visit the
[package page on BinTray](https://bintray.com/lacunasoftware/maven/restpki-client) and click on
the link "SET ME UP!".

PKI Express's helper library
----------------------------

The samples use a helper library which encapsulates the communication with PKI Express. This library
supports **Java 7 or greater**. The lib should be **referenced as a dependency**, as can be seen in the
file [build.gradle](springmvc/build.gradle)

	repositories {
		mavenCentral()
		maven {
			url  "http://dl.bintray.com/lacunasoftware/maven" 
		}
	} 

	dependencies {
		compile("com.lacunasoftware.pkiexpress:pki-express:1.8.0")
	}

If you project uses Maven, please refer to the file [pom.xml](springmvc/pom.xml) instead:

	<dependencies>
		...
		<dependency>
			<groupId>com.lacunasoftware.pkiexpress</groupId>
			<artifactId>pki-express</artifactId>
			<version>1.8.0</version>
		</dependency>
		...
	</dependencies>
	...
	<repositories>
		<repository>
			<id>lacuna.repository</id>
			<name>lacuna repository</name>
			<url>http://dl.bintray.com/lacunasoftware/maven</url>
		</repository>
	</repositories>

If your project uses another tool for dependency resolution (e.g. Ivy), please visit the
[package page on BinTray](https://bintray.com/lacunasoftware/maven/pki-express) and click on
the link "SET ME UP!".

See also
--------

* [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
* [Samples in other programming languages](https://github.com/LacunaSoftware/PkiSuiteSamples)
* [REST PKI's Documentation](http://docs.lacunasoftware.com/en-us/articles/rest-pki/java/index.html)
* [PKI Express's Documentation](http://docs.lacunasoftware.com/en-us/articles/pki-express/java/index.html)
* [REST PKI's Java client library on BinTray](https://bintray.com/lacunasoftware/maven/restpki-client)
* [PKI Express's Java library on Bintray](https://bintray.com/lacunasoftware/maven/pki-express)