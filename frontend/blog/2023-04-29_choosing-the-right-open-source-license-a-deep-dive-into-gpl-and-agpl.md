---
title: "Choosing the right open-source license: A deep dive into GPL and AGPL"
---

## TL;DR

If you're short on time, here's the main difference between the GPL and AGPL licenses:

The GPL, released in 1989, was designed for software that was physically distributed on disks. However, as technology has advanced, software can now be accessed remotely through "Software as a Service" (SaaS). The GPL did not originally cover this scenario, so the Free Software Foundation created the AGPL to address it.

If you want to dive deeper into the topic and explore the key features, benefits, and limitations of each license, we encourage you to keep reading...

Open-source software is a powerful tool for developers around the world, allowing them to collaborate, innovate, and build upon existing code to create new and better software. However, with this power comes responsibility, and choosing the right software license is essential to protect your work and ensure that it remains free and open-source.

In this blog post, we will compare two of the most popular open-source licenses: the **GNU General Public License (GPL)** and the **GNU Affero General Public License (AGPL)**. Both licenses are copy left licenses, meaning that they require any derived work to also be licensed under the same terms, and are designed to protect the freedom and openness of the software.

In this post, we will take a deep dive into the GPL and AGPL licenses, highlighting their similarities and differences, and providing guidance on which one to choose based on your project's needs. Whether you're a developer just starting with open-source software or an experienced user looking to ensure the continued success of your project, this blog post will provide valuable insights into these two powerful licenses.

## GNU General Public License (GPL)

The GNU General Public License (GPL) is one of the most widely used open-source licenses in the world. It was first released in 1989 by Richard Stallman, the founder of the Free Software Foundation (FSF), to protect the GNU operating system from proprietary derivatives. Since then, the GPL license has evolved into a family of licenses, each with specific terms and conditions, but all of them sharing the same core principles.

Definition and history of the GPL license:
The GPL is a copy left license that aims to ensure that any software derived from or based on the licensed code is also free software. This means that the GPL requires anyone who distributes GPL-licensed software to make the source code available to anyone who receives a copy of the software. The GPL also allows anyone to use, modify, and distribute the software, as long as they also make their modifications available under the same GPL license.

#### Key features and benefits of the GPL:

* **Strong Copyleft:** The GPL ensures that any changes or modifications made to the software are also licensed under the same terms, preserving the open-source nature of the software.
* **Compatibility with Other GPL-licensed Code:** Because the GPL is used widely in the open-source community, code licensed under the GPL can be easily integrated into other GPL-licensed projects.
* **Protection of the Community:** The GPL ensures that the source code of the software is available to the community, promoting collaboration and innovation.
* **Trust and Reputation:** The GPL is a well-known and respected license in the open-source community, providing a level of trust and reputation for the software.

#### Some examples of popular software licensed under the GPL include:

* [Linux operating system (https://github.com/torvalds/linux)](https://github.com/torvalds/linux)
* [GNU software (https://www.gnu.org/software/)](https://www.gnu.org/software/)
* [Git (https://github.com/git/git)](https://github.com/git/git)
* [WordPress (https://github.com/WordPress/WordPress)](https://github.com/WordPress/WordPress)

The GPL license has been instrumental in the success of many open-source projects, providing a framework for collaboration, innovation, and community building. Its core principles of openness and freedom have inspired countless developers to contribute to the advancement of technology, and it continues to be a popular choice for projects that want to ensure their code remains free and open-source.

By choosing to use the GPL license, developers are not only protecting their work from being turned into proprietary software but are also contributing to the larger open-source community, inspiring others to follow in their footsteps.

## GNU Affero General Public License (AGPL)

The GNU Affero General Public License (AGPL) is a derivative of the GPL license, designed to address a potential loophole in the GPL's copy left requirements. The AGPL requires that any software that uses AGPL-licensed code must also be made available as open-source under the same license, even if the software is accessed over a network.

Like the GPL, the AGPL is a copy left license that ensures the continued openness and freedom of the software. However, the AGPL places additional requirements on those who use the software in a networked environment, making it a popular choice for software that is accessed over the internet.

#### Key features and benefits of the AGPL:

* **Stronger Copyleft:** The AGPL ensures that any changes or modifications made to the software are also licensed under the same terms, even when the software is used over a network.
* **Compatibility with the GPL:** Because the AGPL is based on the GPL, code licensed under the AGPL can be used in projects that are licensed under the GPL.
* **Protection of the Community:** The AGPL ensures that any changes made to the software are available to the community, promoting collaboration and innovation.

#### Here are some of the popular AGPL licensed software:

* [Twitter's recommendation algorithm (https://github.com/twitter/the-algorithm)](https://github.com/twitter/the-algorithm)
* [Grafana (https://github.com/grafana/grafana)](https://github.com/grafana/grafana)
* [Mastodon (https://github.com/mastodon/mastodon)](https://github.com/mastodon/mastodon)
* [ChatGPT desktop application (https://github.com/lencx/ChatGPT)](https://github.com/lencx/ChatGPT)

In summary, the AGPL license is a strong choice for software projects that are accessed over a network and want to ensure that any changes or modifications to the software are also available to the community. While it has some limitations and complexities, it is a valuable addition to the family of open-source licenses and has been used successfully in many projects.

## GPL vs AGPL

#### Similarities

* Both are free and open-source software licenses that promote the sharing and collaboration of software code.
* Both are copyleft licenses that require any derivative work to be licensed under the same terms as the original work.
* Both require the distribution of source code along with the software.
* Both prohibit the addition of further restrictions to the license.

#### Differences

* The GPL applies only to the distribution of software, while the AGPL applies to software accessed over a network as well.
* The GPL has been widely adopted and is used by many high-profile projects, while the AGPL is less common.

## Conclusion

In conclusion, the GPL and AGPL are two popular open-source licenses that offer many benefits to developers and users alike. While they share some similarities, they also have some important differences that can affect your project's licensing and distribution.

The GPL is a strong copyleft license that ensures that any derivative works of your software must also be released under the same license, ensuring that the software remains free and open-source. On the other hand, the AGPL adds an additional requirement that applies when the software is used over a network, such as in a web application. This ensures that users who access the software remotely still have access to the source code and can modify and distribute it as needed.

When deciding between the GPL and AGPL, it's important to consider your project's needs and goals. If you're developing a standalone desktop application or library, the GPL may be the best choice. If your software will be used over a network, the AGPL may be a better fit.

Regardless of which license you choose, it's important to follow best practices for complying with the terms of the license, such as ensuring that any derivative works are also licensed under the same terms and providing access to the source code. By doing so, you can help promote the principles of open-source software and ensure that your project can be freely used, modified, and shared by others.
