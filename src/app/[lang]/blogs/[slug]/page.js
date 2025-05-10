// import { getSingleMedia } from "@/lib/getPages";
import DetailWidget from "@/widgets/DetailWidget";
import { notFound } from "next/navigation";

const data = {
    id: 2,
    blog_id: 2,
    lang: "en",
    title: "Jalabiya",
    short_description: "IKKXA offers the best and most recent models of jalabiyas in Saudi Arabia.",
    long_description: `<p>The <strong>jalabiya</strong> is a traditional, loose-fitting garment
   commonly worn in Arab countries. It is similar to a robe and is known 
  for its comfort and ease of wear. Both men and women can wear jalabiyas,
   and they are often made from light, breathable fabrics, making them 
  ideal for the region's hot climate.</p>
  <p>Jalabiyas come in various designs, from simple and plain to colourful 
  and embellished with intricate embroidery or patterns. They are 
  versatile garments that can be worn for daily activities at home or for 
  special occasions, depending on their style and material.</p>
  <a href="https://birbaboti.com/information-learn-about-various-womens-apparel-with-us/what-is-a-jalabiya-and-everything-you-need-to-know-about-it/" class="tooltip-target" data-citationid="fe4743d8-f812-9926-9b21-6984d16d48a2-9-group" target="_blank" style="color: rgb(0, 0, 0);">In
   essence, the jalabiya is a garment that combines practicality with 
  cultural significance, reflecting the traditional attire of the Arab 
  world</a>`,
    tags: "jalabiya,جلابية,jallabiya,jalbya,jalabia,jlbia,kaftan,caftan,kftan",
    meta_title: "jalabiya",
    meta_description: "جلابية \r\n\r\nدار إمتنان \r\nملابس رمضان\r\n\r\nثوب طويل صيفي\r\nثوب\r\nفستان طويل",
    meta_keyword: "جلابية,jalabiya,jlbya,kaftan,jallabiya",
    created_at: "2024-03-12T17:39:21.000000Z",
    updated_at: "2024-03-12T18:14:18.000000Z",
    image:"https://uae.ikkxa.com/public/images/default/260x175.png",
    blogs : [
        {
            id: 1,
            slug: "jalabiya",
            title: "Jalabiya",
            short_description: "IKKXA offers the best and most recent models of jalabiyas in Saudi Arabia.",
            thumbnail: "https://uae.ikkxa.com/public/images/default/260x175.png"
        },
        {
            id: 2,
            slug: "abaya",
            title: "Abaya",
            short_description: "IKKXA offers the best and most recent models of jalabiyas in Saudi Arabia.",
            thumbnail: "https://uae.ikkxa.com/public/images/default/260x175.png"
        }
    ]

  };
  


// export async function generateMetadata({ params: { slug, lang } }) {
//     const data = await getSingleMedia(slug, lang);
//     const seo = data?.data?.seo
//     // console.log("meta madia dataaaaaaaaaaaaaaa",data);
//     return {
//         title: seo?.metaTitle,
//         description: seo?.metaDescription,
//         // keywords: seo?.meta_keywords,
//     };
// }


export default async function LeaderSinglePage({ params: { slug, lang } }) {
    // const data = await getSingleMedia(slug, lang)
    // if (!data) return notFound();
    return (
        <main>
            <DetailWidget datas={data}/>
        </main>
    )
}
