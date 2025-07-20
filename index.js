const fetch = require('node-fetch'); // تحتاج تثبيت node-fetch@2
const os = require('os');
const Config = require('./Config');

const Api = "https://katana.it.com"; // -->> [ API ]
const ScriptName = "" // [ اسم السكربت في الموقع ]
const LicenseKey = Config.License; // -->> [ رخصة استخدام العميل ]


const webhook_start = ""; // ويب هوك تشغيل السكربت
const webhook_unauthorized = ""; // ويب هوك حدوث مشكلة في api
const webhook_connection_fail = ""; // ويب هوك حدوث مشكلة في api

const Config_Katana = {
    Made_By: "NQ Dev", // -->> [ حقوق في cmd ]
    contact: "NQ", // -->> [ حقوق في cmd ]
    EnableFreezeOnFail: true, // -->> [ تكريش السيرفر ]< true - تفعيل > < false - تعطيل > 

    Bot_Setting: {
        UserName_Bot: "🔐 Katana License Bot", // -->> [ اسم البوت ]
        Logo_Bot: "https://cdn.discordapp.com/icons/1278151350781349888/a_1be0487f6af5f70964afa54ca243f6a0.gif" // -->> [ لوقو البوت ]
    }
};


async function sendEmbedToDiscord(title, description, color, webhook) {
      if (!webhook || webhook.trim() === "") {
        console.log("Webhook URL not set, skipping Discord embed.");
        return;
    }
    const embed = [{
        title,
        description: "```" + description + "```",
        color,
        fields: [
            { name: "📜 Script", value: `\`${ScriptName}\``, inline: true },
            { name: "🖥️ IP Address", value: `\`${global.IP || "N/A"}\``, inline: true },
            { name: "👤 Licensed ", value: `\`${LicenseKey || "N/A"}\``, inline: true },
            { name: "📂 Resource Path", value: `\`${process.cwd()}\``, inline: false },
            { name: "🕒 Timestamp", value: `\`${new Date().toISOString()}\``, inline: false }
        ],
        footer: {
            text: `🔒 Katana License System | Made by ${Config_Katana.Made_By}`,
            icon_url: Config_Katana.Bot_Setting.Logo_Bot
        },
        author: {
            name: Config_Katana.Bot_Setting.UserName_Bot,
            icon_url: Config_Katana.Bot_Setting.Logo_Bot
        }
    }];

    await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: Config_Katana.Bot_Setting.UserName_Bot,
            avatar_url: Config_Katana.Bot_Setting.Logo_Bot,
            embeds: embed
        })
    });
}

async function onResourceStart() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) throw new Error("Failed to fetch IP");
        const ipData = await ipResponse.json();
        global.IP = ipData.ip;

        const data = {
            script: ScriptName,
            ip: global.IP,
            license: LicenseKey,
        };

        const licenseResponse = await fetch(Api + '/api/check', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!licenseResponse.ok) {
            console.log("Error communicating with Katana API");
            await sendEmbedToDiscord("❌ License Check Failed", "Error communicating with Katana API", 16776960, webhook_connection_fail);
            return;
        }

        const response = await licenseResponse.json();

        if (response && response.status === "success") {
            console.log("[ katana.it.com ] CheckingLicense..");
            await new Promise(r => setTimeout(r, 2000));
            console.log("[ katana.it.com ] CheckingLicense..");
            await new Promise(r => setTimeout(r, 1000));
            console.log("===========================================================================");
            console.log(`Good License [ katana.it.com ] This Script Made By ${Config_Katana.Made_By}`);
            console.log("===========================================================================");

            await sendEmbedToDiscord("✅ License Authorized", "License Key is valid and authorized", 5763719, webhook_start);

            // ========================= Code Script - كود سكربتك ========================

            // هنا - Here

            // ===========================================================================

        } else if (response && response.status === "error") {
            console.log("[ katana.it.com ] CheckingLicense..");
            await new Promise(r => setTimeout(r, 2000));
            console.log("[ katana.it.com ] CheckingLicense..");
            await new Promise(r => setTimeout(r, 1000));
            console.log("======== [ katana.it.com ] Wrong License or Wrong IP ========");
            console.log("======== I will stop Myself and The Other Scripts In 2s ========");
            console.log(`======== Bye Bye -- > If there is a problem, contact ${Config_Katana.contact} ========`);

            await sendEmbedToDiscord("❌ Unauthorized Access", "Invalid License or Unauthorized IP", 16711680, webhook_unauthorized);
            await new Promise(r => setTimeout(r, 5000));

            if (Config_Katana.EnableFreezeOnFail) {
                while (true) { await new Promise(r => setTimeout(r, 1000)); }
            }
        } else {
            console.log("Error API Website , Check [ katana.it.com ] Call NQ or Open Ticket in discord.gg/katan");
            await new Promise(r => setTimeout(r, 5000));
            if (Config_Katana.EnableFreezeOnFail) {
                while (true) { await new Promise(r => setTimeout(r, 1000)); }
            }
        }
    } catch (error) {
        console.log("Error fetching IP or license check:", error);
        await sendEmbedToDiscord("❌ System Error", "Failed to fetch server IP or license check", 16711680, webhook_connection_fail);
    }
}

// تشغيل الدالة عند بدء المورد (يمكنك استدعاؤها حسب المنطق في Node.js)
onResourceStart();
