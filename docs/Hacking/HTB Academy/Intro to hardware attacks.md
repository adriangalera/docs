# Introduction to hardware attacks

This mini-module provides a theoretical focus on Bluetooth hacking methods, cryptanalysis side-channel attacks, and microprocessor vulnerabilities.

## Bluetooth attacks

Bluetooth, a wireless technology standard, is designed for transferring data over short distances. The technology operates by establishing personal area networks (PANs) using radio frequencies in the ISM band from 2.402 GHz to 2.480 GHz.

Device pairing:
1. Discovery: a device broadcast its presence to other Bluetooth devices.
2. Pairing Request: a second device finds the broadcasted device and sends a pairing request.
3. Authentication: the devices authenticate each other using a shared secret. This involve entering a PIN on one or both devices.

When they are paired, they can connect automatically in the future.

After pairing, Bluetooth devices form a network known as a `piconet`. This collection of devices connected via Bluetooth technology consists of one main device and up to seven active client devices. The main device coordinates communication within the piconet.

The main device decides which can of transmissions will happen in the piconet. There are two types of links for data transfer:

- `Synchronous Connection Oriented (SCO) links`: used for audio communication. Guarantee uninterrumpted communication.
- `Asynchronous Connection-Less (ACL) links`: All other type of data, no reservation.

Risks of Bluetooth:

- Unauthorised Access: Attackers can exploit vulnerabilities to take control of the device or eavesdrop data exchanges.
- Data theft: attackers might exploit vulnerabilities to extract personal and sensitive data.
- Interferece: Bluetooth works in the 2.4 Ghz band which is shared by many technologies. An attacker might corrupt the connections by creating intentional interferences.
- DoS: Attackers can overwhlem the device
- Device tracking: attackers can track radio signals to track the physical location of the device.

Bluetooth atacks:

- `Bluejacking`: an attacker send unsolicited messages to a device. Kind of spam. Apple devices were susceptible to an attack very similar to Bluejacking via AirDrop
- `Bluesnarfing`: unauthorised access to a Bluetooth device's data.
- `Bluebugging`: an attacker control a Bluetooth device. Making calls, sending messages and accessing data.
- `Car whisperer`: specifically target vehicles. Remotely unlock car doors or even start the engine.
- `Bluesmaking & DoS`: disrupt or disable the connection between devices. Bluesmacking send excessive connection requests leaving the targeted device unusable.
- `Man-in-the-Middle`: positioning the attacker between the devices. They can eavesdrop information or alter data.
- `BlueBorne`: control of a device without requiring any user interaction or pairing.
- `Key extraction`: Retrieve encryption keys. Undermine the confidentiality of communications.
- `Eavesdropping`: intercepting and listening to Bluetooth communications. Attackers capture data transmitted.
- `Bluetooth Impersonation attack`: the attacker impersonates a trusted Bluetooth device. This results in data theft, unauthorized access.

## Cryptoanalysis

Cryptanalysis is a fascinating and essential facet of cybersecurity that delves into the intricate world of cyphers and codes. It is the art and science of breaking ciphertext, cyphers and cryptosystems - essentially, Cryptanalysis is the process of decrypting coded or encrypted data without access to the key used in the encryption process.

There are some interesting techniques in cryptoanalysis:

- `Frequency Analysis`: statistical study of the letters or symbols in the cypher text.
- `Pattern finding`: certain groups of characters or patterns reoccur in the cypher text, they may represent the same plain text.
- `Brute force attacks`: try all possible combinations

Cryptoanalysis side-channel attacks are a category of attacks where information is leaked during the execution of cryptographic algorithms. This kind of attacks try to attack the physical implementation of these systems. These attacks leverage indirect information such as timing data, power usage, electromagnetic emissions, and acoustic signals. Can be classified into:

- `Passive`: the attacker monitors the system without actively interfering. E.g: power consumption, timing or electromagnetic emissions.
- `Active`: the attacker manipulates the system. E.g: add particular inputs to observe the output or time changes.

There are different kinds of side-channel attacks:

- Timing attacks: exploit the fact that different operations and instructions may take different amounts of time to execute on a computer. These algorithms are designed to run for the same amount of time, regardless of the input or any secret information
- Power-Monitoring attacks: exploit variations in the device's power consumption.
- Acoustic: extract sensitive information from a system by analysing the sound emissions, e.g. the acoustic emissions of typing on a keyboard can vary with different keys, which can be exploited through keyboard eavesdropping

## Microprocessors

A microprocessor is an integrated circuit (IC) that encapsulates the functions of a central processing unit (CPU) on a single silicon chip. 

It is formed by multiple components:

- `Control Unit (CU)`: Directs the operation of the processor, interconnects the input,output,ALU,etc..
- `Arithmetic logic unit (ALU)`: Performs arithmetic and logic operations.
- `Instruction Set architecture`: defines the data types, the registers, and the set of machine-language commands.

Everything in a processor works thanks to the transistors that store the `0` and `1` physically. The control unit uses combinations of these binary values to represent different commands and data. The arithmetic logic unit uses transistors based on these binary instructions to perform arithmetic and logical operations. 

There are two main architectures:

- CISC (Complex Instruction Set Computer): many tools in one package.
- RISC (Reduced Instruction Set Computer): do one thing very well.

Microprocessors can contain weaknesses or flaws in the design or implementation of microprocessors that can be exploited to compromise the security of a computing system.

Vulnerabilities exploit some optimizations like: 

- Speculative execution: Spectre vulnerability forces the processor to discard speculative results but they are kept in the cache for some time. The attacker can construct special machine instructions to force the speculative execution to leak the data into the cache while the execution flow goes normally. Then, a side-attack channel is used to read the cache contents.
- Out of order execution. The processor executes the instructions not in the sequential order defined by the program but in an order dictated by the availability of resources. The meltdown vulnerability induces an exception (attempt to access an off-limit memory location), the out-or-order execution allows further instructions that depend on this access to be executed before the exception is handled. And again, the attacker can store the results into the cache and read it with a side-channel attack. 