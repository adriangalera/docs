# Android Fundamentals

Android is a mobile operating system created for touchscreen devices like phones and tablets. Based on a modified version of the Linux Kernel.

As we mentioned in the previous section, Android is a Linux-Based OS, and once someone gains access to a shell on the device, Linux commands can be executed.

## Software stack

From lower level to higher level:

1. Linux kernel: managing device hardware such as the display, camera, bluetooth, wifi, audio, USB, and more. Threading and memory management. Also numerous security features (user-based permissions and process isolation).

2. Hardware Abstraction Layer (HAL): standardized interface for interacting with hardware components, such as cameras, Bluetooth, sensors, and input devices. Acting as a bridge between hardware and the higher-level software layers, HAL ensures consistency in how software accesses hardware features. Given the different amount of hardware sensors, software needs to find a common interface to interact with the hardware.

3. Android Runtime: Android Runtime (ART) is the managed runtime environment used by the Android operating system to execute applications. Application code is compiled into native machine code at install time. This is like the JVM but for Android, e.g: performs garbage collection, memory management, etc..

4. Native C/C++ libraries: Developers generally use these libraries to achieve high performance or write low-level code to interact directly with the hardware.

5. Java API Framework: This component provides software tools and interfaces for building Android applications.

6. System apps: This component includes all the pre-installed applications that come with the Android operating system.

## Rooting

Android separates the flash storage into the following two main partitions : `/system` and `/data`. The partition `/system/` is used by the operating system, and the partition `/data/` is used for user data and application installations.

In Android, users don't have root access to the operating system, and some partitions (like /system/) are read-only.

In order to have full `root` access to the device, you need to exploit some security flaws, this process is called `Rooting`.

## Import directories

| Directory                       | Description                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| /data/data                      | Contains all the applications that are installed by the user                                                                 |
| /data/user/0                    | Contains data that only the app can access                                                                                   |
| /data/app                       | Contains the APKs of the applications that are installed by the user                                                         |
| /system/app                     | Contains the pre-installed applications of the device                                                                        |
| /system/bin                     | Contains binary files                                                                                                        |
| /data/local/tmp                 | A world-writable directory                                                                                                   |
| /data/system                    | Contains system configuration files                                                                                          |
| /etc/apns-conf.xml              | Contains the default Access Point Name (APN) configurations. APN is used in order for the device to connect with the carrier |
| /data/misc/wifi                 | Contains WiFi configuration files                                                                                            |
| /data/misc/user/0/cacerts-added | User certificate store. It contains certificates added by the user                                                           |
| /etc/security/cacerts/          | System certificate store. Permission to non-root users is not permitted                                                      |
| /sdcard                         | Contains a symbolic link to the directories DCIM, Downloads, Music, Pictures, etc.                                           |

## Android Security

Kotlin and Java are the two primary languages used to develop Android applications. The Android SDK tools compile application source code along with resource files and assets into an Android Package (APK). An APK is an archive file with a .apk extension that contains all the components needed to install and run an Android app, including compiled bytecode (.dex), manifest metadata, resources, and native libraries.

Each Android application runs within its own isolated security sandbox, enforced by the underlying Linux-based architecture. This sandboxing model is supported by several core Android security features:

- Android is a multi-user Linux system where each application is treated as a separate user.

- By default, the system assigns each app a unique Linux user ID (UID). This UID is used by the system for access control, but is not exposed to the app itself.

- File system permissions ensure that only the app assigned a particular UID can access its own files.

- Each app runs in its own process, and each process runs in a separate instance of the Android Runtime (ART) virtual machine, ensuring memory isolation.

- The system launches the app's process as needed and terminates it when no longer required or when reclaiming system resources.

- Android enforces the principle of least privilege, meaning apps only receive the permissions necessary to perform their core functionality. Additional privileges must be explicitly declared in the app's manifest and approved by the user (or system, depending on the API level).

Android uses Linux’s user-based security model to isolate applications by assigning each app a unique user ID (UID) and running it in its own process. This creates a kernel-level application sandbox that enforces strict boundaries between apps and the system, preventing unauthorized data access or code execution across app boundaries.

Escaping this sandbox requires compromising the kernel itself, typically through a privilege escalation exploit.

We can see this, when we list the files:

```bash
root:/# ls -l /data/data/

drwx------  4 system         system         4096 2022-12-28 11:47 android
drwx------  4 bluetooth      bluetooth      4096 2022-12-28 11:47 com.android.bluetooth
drwx------  5 radio          radio          4096 2022-12-28 11:48 com.android.ons
drwx------  5 shell          shell          4096 2022-12-28 11:49 com.android.shell
drwx------ 11 u0_a114        u0_a114        4096 2022-12-30 12:41 com.android.chrome
drwx------  5 u0_a119        u0_a119        4096 2022-12-28 11:49 com.android.camera2
```

To install an application on a device or upload it to the Play Store, the APK file must be signed. Signing the APK is crucial for security, as it protects the package from malicious modifications.

The certificates that are used to sign an application are self-signed. One can sign an APK file with apksigner tool (Signature Scheme v4) using the following commands:

```bash
echo -e "password\npassword\njohn doe\ntest\ntest\ntest\ntest\ntest\nyes" > params.txt
cat params.txt | keytool -genkey -keystore key.keystore -validity 1000 -keyalg RSA -alias john
zipalign -p -f -v 4 myapp.apk myapp_signed.apk
echo password | apksigner sign --ks key.keystore myapp_signed.apk
```

Verified Boot is an Android security feature that ensures the integrity of the operating system. This is achieved using a unique set of cryptographic keys to sign and verify the boot image and ensure that only the authorized parties can modify the system

## APK Structure

The Android Package Kit file—commonly known as an APK—is the file format used by the Android operating system to distribute and install applications. An APK is essentially an archive that contains all the components needed for an Android app to run. It is based on `zip`, therefore it can be unzipped:

```bash
adriangalera@htb[/htb]$ unzip myapp.apk
adriangalera@htb[/htb]$ ls -l

total 27584
-rw-r--r--    1 bertolis  bertolis     4220 Jan  1  1981 AndroidManifest.xml
drwxr-xr-x   49 bertolis  bertolis     1568 May 10 13:36 META-INF
drwxr-xr-x    3 bertolis  bertolis       96 May 10 13:36 assets
-rw-r--r--    1 bertolis  bertolis  8285624 Jan  1  1981 classes.dex # contains the application code
drwxr-xr-x    9 bertolis  bertolis      288 May 10 13:36 kotlin
drwxr-xr-x    6 bertolis  bertolis      192 May 10 13:36 lib
drwxr-xr-x  545 bertolis  bertolis    17440 May 10 13:36 res
-rw-r--r--    1 bertolis  bertolis   922940 Jan  1  1981 resources.arsc
```

The files extracted from the APK are encoded, and neither the source code nor the configuration files are human-readable.

Let's deep dive:

- META-INF: contains verification information
- assets: This folder contains assets that developers bundle with the application, and can be retrieved by the AssetManager.
- lib: This folder contains native libraries with compiled code targeting different device architectures. Android applications that use the Native Development Kit (NDK) may include components written in C or C++.
- res: This folder contains predefined application resources that cannot be modified by the user at runtime, unlike assets. These resources include XML files defining color state lists, UI layouts, fonts, values, configurations for OS versions, screen orientations, network settings, and more.
- AndroidManifest.xml: metadata about the application.
- classes.dex: This file contains all compiled Java (or Kotlin) classes in DEX (Dalvik Executable) format, which are executed by the Android Runtime (ART).
- resources.arsc: This file contains precompiled resources that are used by the app at runtime. It maps resource identifiers in the code (e.g., R.string.app_name) to their actual values, such as strings, colors, layouts, and styles.

## Types of application

- Native: direct access to platform. Built with Kotlin or Java.
- Web apps: developed to be responsive and accessible from mobile web browsers. They are typically built using HTML, CSS, and JavaScript.
- Hybrid apps: Hybrid apps combine elements of both native and web apps and are designed to be cross-platform. They use WebViews to display web content within a native app container.

## Android Application Components and IPC

Application components are the building blocks that define different parts of an Android application, such as the user interface and core functionality. These components are declared in the AndroidManifest.xml and can be used individually or in tandem with one another. Interprocess Communication (IPC) is a mechanism that allows for communication between applications or different processes within the same application. 

### Activities

Activities are a fundamental application component, representing a single screen with a user interface. An Activity is the main component that allows the interaction between the user and the app, and can be started by other Activities, apps, or system events. 

The Android operating system maintains an Activity stack as part of the task that the app belongs to. When a new Activity is launched, it's placed on top of the stack and becomes the active Activity. The previous Activity is paused and remains in the stack.

Activities are declared in AndroidManifest.xml and can be exported so that other apps can use the activity.

> The exported attribute can be set on `<activity>, <service>, <receiver>, and <provider>` elements in the AndroidManifest.xml file.

### Services

A Service is an Android application component that performs long-running operations in the background without providing a user interface. Services can be used for tasks like downloading files, playing music, or communicating with a remote server, and can continue working even after the user has left the app.

There are:

- Foreground services: Foreground services perform operations that require user attention. Will generate notifications, e.g: media players or navigation apps.

- Background services: perform operations that do not require user interaction.

- Bound services: They provide a client-server interface that enables components—even across different processes—to interact with the service using Interprocess Communication (IPC).

### Broadcast receivers

Broadcast Receivers can be considered as both Application Components and Interprocess Communication (IPC) mechanisms. 

As an IPC mechanism, Broadcast Receivers enable communication between different applications by sending and receiving Intents. These Intents can be sent by the Android system, other apps, or the app itself. 

As an Application Component, Broadcast Receivers are designed to respond to system-wide or custom events broadcasted by other applications.

### Content Providers

As an IPC mechanism, Content Providers enable communication between applications by allowing them to access, modify, or delete data using a consistent interface through the ContentResolver class. 

As an application component, Content Providers are responsible for managing and exposing data structures within or to other apps.

They allow data sharing inside or outside the application.

### Intents

Messaging objects used by applications or the Android system to request actions from other components such as Activities, Services, and Broadcast receivers. While Intents are not primarily designed for Interprocess Communication (IPC), they may be used when an application wants to interact with a component (such as a service) that resides in a different process. 

Typical use cases are:

1. Starting an activity:

```java
Intent intent = new Intent(this, ContactDetailActivity.class);
intent.putExtra("contact_id", selectedContactId);
startActivity(intent);
```

2. Starting a service:

```java
Intent intent = new Intent(this, DownloadService.class);
intent.putExtra("file_url", fileUrl);
startService(intent);
```

3. Deliver a broadcast message:

```java
Intent intent = new Intent("com.example.ACTION_BATTERY_LOW");
sendBroadcast(intent);
```

We can define `explicit` intents such as:

```java
Intent intent = new Intent(this, TargetActivity.class);
startActivity(intent); 
```

which is used to navigate inside the app. The class has to be known.

or `implicit` intents, where we don't know exactly the class but we rely on the system to find a suitable actor to perform an action:

```java
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setData(Uri.parse("https://www.example.com"));
startActivity(intent);
```

Intents can have data using the `putExtra` method:

```java
Intent intent = new Intent(this, TargetActivity.class);
intent.putExtra("key", "value");
startActivity(intent);
```

### Binders

The Binder is Android's core Interprocess Communication (IPC) mechanism, enabling efficient and secure communication between different processes.

It allows a client process to invoke methods on a remote object located in another process (but owned by the same application) as if the object were local.

### Deep links

A Deep Link is an Interprocess Communication (IPC) mechanism that allows users to navigate directly to specific content within an app.

For example, a user might receive a promotional email about a flash sale on a specific product. Instead of directing the user to the website, the link opens the corresponding app to display the product.

There are standard deep links:

```html
<div>
	<p>Buy our latest PC parts.</p>
	<a href="app://myapp/products/cpu"> </a>
</div>
```

If we declare an this intent-filter:

```xml
<data android:scheme="app"
              android:host="myapp"
              android:pathPrefix="/products/" />
```

When the user clicks on the link, the specific product will appear in the application.

Security risks may arise from improper implementation.

The other type of deep links are Android deeplinks. Let's imagine this example:

```html
<div>
	<p>Buy our latest PC parts.</p>
	<a href="https://www.myapp.com/products/cpu"> </a>
</div>
```

we can define this intent-filter to capture it:

```xml
        <data android:scheme="https"
              android:host="www.myapp.com"
              android:pathPrefix="/products/" />
```

If the app that handles the deep link isn't installed, the link will open in a web browser listing the products. 

### Android Debug Bride

Android Debug Bridge (ADB) is a versatile command-line tool that enables communication between a computer and a device. It allows developers to perform tasks like installing and debugging applications, transferring files between the host computer and the device, and accessing the device through a shell.

Here, there are some useful adb commands:

| Command                                  | Description                          |
| ---------------------------------------- | ------------------------------------ |
| `adb help`                               | List all commands.                   |
| `adb kill-server`                        | Kills the adb server.                |
| `adb devices`                            | Lists connected devices.             |
| `adb root`                               | Restarts adbd with root permissions. |
| `adb install <apk>`                      | Install app.                         |
| `adb push <local> <remote>`              | Copy file/dir to device.             |
| `adb pull <remote> <local>`              | Copy file/dir from device.           |
| `adb logcat [options] [filter] [filter]` | View device log.                     |
| `adb shell`                              | Opens a shell in the device.         |

### Android penetration testing

- Enumeration and information gathering

Gather information about the app and its architecture.
Understand the functionality of the application.
Enumerate any data structure the app uses that is stored in the local storage.

- Static analysis

Understand the manifest file of the application. Review the app's components, permissions, and configurations.
Decompile and analyze the application's source code to understand the flow and find potential vulnerabilities.
Examine native or third-party libraries, frameworks, and dependencies the app uses.

- Dynamic analysis

Monitor the application's behavior during runtime. Enumerate the local storage for files and data structures created after performing various functionalities.
Perform dynamic instrumentation to read the memory of the application during runtime.
Intercept network traffic and test the app for vulnerabilities such as authentication bypass and insecure data transmission.
Check for Server-Side attacks by analyzing API calls and looking for vulnerabilities such as injection and XSS attacks.

Suggested tools:

- `adb`: command-line tool to communicate with Android devices.
- `JADX`: This tool allows us to reverse engineer an application and view its source code through a graphical interface. It provides the user with a Java-like pseudocode that is close enough to the actual code.
- `APKTool`: This tool also allows reverse engineering Android applications. It will decompile the source code and decode the resources of the APK file. APKTool also enables us to edit the source code and configuration files, recompile the code, and build the APK file again.
- `Ghidra`: Ghidra is often used to analyze the native C++ libraries loaded to the application.
- `Burp Suite`: to analyze HTTP communication
- `Frida`: A dynamic instrumentation toolkit used by developers, reverse engineers, and security researchers. It enables us to inject snippets of JavaScript or native code into the running processes of Android applications, allowing us to analyze and manipulate them during runtime.
- `Autopsy`: Autopsy will help us investigate disk images of Android devices and let us search for files, databases, calls, messages, and logs, using the provided GUI.

There's also some automated tools:

- `MobSF`: An automated security testing framework for Android, iOS, and Windows platforms that performs static, dynamic, and malware analysis on mobile applications.
- `Drozer`: A comprehensive security and attack framework that allows us to assess the security of Android applications. It simulates various attack vectors and provides multiple tools to analyze, exploit, and debug Android applications.
- `Qark`: A static code analysis tool that automates the discovery of security vulnerabilities in Android applications. It can also create Proof-of-Concept deployable APKs and ADB commands to exploit the vulnerabilities it finds.
- `Objection`: A runtime mobile exploration toolkit that uses Frida to provide an easy environment for assessing Android and iOS application security. It automates several common tasks, such as bypassing SSL pinning, and users won't be needed to create custom scripts whenever they need to exploit common vulnerabilities.
- `Medusa`: An extensible and modularized framework that automates processes and techniques practiced during the dynamic analysis of Android Applications. Medusa is based on Frida and can analyze and enumerate an app, attack common entry points, and automate processes like application patching, MITM attack, and more. Medusa can add and remove hooks for Java or Native methods and has more than 90 modules that can be combined.
- `Androbugs`: automatically scans Android applications and checks for security issues and vulnerabilities.