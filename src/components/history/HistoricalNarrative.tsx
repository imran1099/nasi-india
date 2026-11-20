import React from "react";
import {
  SparklesIcon,
  CheckCircleIcon,
  MailIcon,
} from "@/components/icons";

export function HistoricalNarrative() {
  return (
    <article className="space-y-12 text-[#17324D]">
      {/* 1. Introductory Framing */}
      <div className="relative rounded-3xl bg-linear-to-br from-[#005596] via-[#004780] to-[#002D54] text-white p-8 sm:p-12 shadow-xl overflow-hidden border border-[#003A6B]">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#FFE566] bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <SparklesIcon size={14} className="text-[#FFE566]" />
              52 Years of Service (1974 – 2026)
            </span>
            <span className="text-xs text-[#D7E8F5] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              Authoritative National Archive
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight text-white">
            Soroptimism in India: <br className="hidden sm:inline" />
            <span className="text-[#FFE566] italic">A Journey of Sisterhood, Leadership and Service</span>
          </h2>

          <p className="text-base sm:text-xl text-[#F4FAFF] leading-relaxed font-serif italic border-l-4 border-[#FFE566] pl-4 sm:pl-6 py-1">
            “Over the last 52 years in India, from the shores of the Arabian Sea to the Bay of Bengal, across the Deccan Plateau and the Coromandel Coast, to the capital of India, from the high mountains of Ladakh and the valleys of Kashmir to the foothills of the Eastern Himalayas, a movement of women, united by a common purpose, has grown across cities, cultures and generations, shaping an enduring legacy of sisterhood, leadership and service.”
          </p>
        </div>
      </div>

      {/* 2. Chapter 1: The Beginnings (1974) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white">
            1974
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
            The Beginnings: A Vision Takes Root in India
          </h3>
        </div>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            The story of Soroptimism in India is a story of vision, sisterhood and the collective determination of women to make a meaningful difference in society. What began as a small initiative among a group of professional women in Bombay in 1974 gradually evolved into a national network of Soroptimist International clubs, spanning diverse geographical regions and communities across the country.
          </p>
          <p>
            The first Soroptimist International club in India, <strong>SI Bombay North</strong>, was chartered on <strong>2 September 1974</strong>. Its Founder President, <strong>Perin Bhiwandiwala</strong>, an accomplished architect educated in England, is credited with introducing the Soroptimist movement to India. Having become acquainted with the organisation during her stay in England, she returned with the vision of establishing a similar fellowship in her own country. Through a series of meetings and conversations, she brought together a group of enthusiastic professional women.
          </p>
          <p>
            <strong>Dorothy Mackenzie White</strong> represented SIGBI at the chartering ceremony, and seventeen members formed the founding membership of the first club in India. This modest beginning, finding its gateway to India literally via Bombay, was soon to take root in eastern India.
          </p>
        </div>
      </section>

      {/* 3. Chapter 2: The Movement Gathers Momentum: Eastern India & Project 5-O (1979) */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white">
            1979
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
            The Movement Gathers Momentum: Eastern India & Project 5-O
          </h3>
        </div>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            The next milestone came in eastern India with the formation of <strong>SI Calcutta</strong>, chartered on <strong>27 October 1979</strong>, under Founder President <strong>Aroti Dutta</strong>, with <strong>Laxmi Parasuram</strong> as Secretary and 23 founding members.
          </p>
          <div className="p-6 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#005596] block">
              Historical Origin
            </span>
            <p className="text-sm sm:text-base italic text-[#17324D] leading-relaxed">
              Its origins are rooted in an inspiring act of kindness. While in London, Aroti Dutta fell ill and was cared for by her hostess. When Aroti asked how she could reciprocate the kindness, her hostess suggested that she establish a Soroptimist club in her home city. Inspired by this suggestion, Aroti introduced the philosophy of Soroptimism to women in Calcutta. Jean Wishart of SIGBI presented the charter.
            </p>
          </div>
          <p>
            The club’s commitment to service soon found expression beyond its own membership. Founder President <strong>Aroti Dutta</strong> and founder member <strong>Chitra Ghosh</strong> initiated <strong>Project 5-O</strong> in Bratachari village, Joka, West Bengal. The project was adopted for activities aimed at supporting women through education and vocational training, reflecting the movement’s early emphasis on practical opportunities for women’s development.
          </p>
          <p>
            Aroti Dutta subsequently became the first President of the <strong>National Association of Soroptimist International Clubs of India (NASI–India)</strong> in 1990, playing a significant role in shaping the movement’s national identity.
          </p>
        </div>
      </section>

      {/* 4. Chapter 3: Expanding Across Regions: The 1980s and 1990s */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white">
            1980s – 1990s
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
            Expanding Across Regions & National Institutionalisation
          </h3>
        </div>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            From Calcutta, the movement gradually extended across West Bengal and western India. In <strong>August 1987</strong>, <strong>SI Burdwan</strong> was chartered under Founder President <strong>Santanwana Sen</strong>, with 15 members, mothered by SI Calcutta. <strong>Katharine Fussel</strong>, President of SIGBI, attended the chartering, strengthening the connection between the growing Indian network and its international federation.
          </p>

          <div className="p-6 rounded-2xl bg-[#005596]/5 border border-[#005596]/20 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#005596] tracking-wider">
              <CheckCircleIcon size={16} />
              <span>1989 – 1994: Genesis of the National Association</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-[#17324D]">
              In 1989, with the encouragement of SIGBI officials who were keen to see India develop as a National Region, the idea of a national body was conceptualised. At that time, prominent clubs included Bombay North, Bombay South, Calcutta, Burdwan, and Jabalpur. <strong>Chitra Ghosh</strong> of Calcutta and <strong>Antoinette D’Costa</strong> of Bombay South were instrumental in bringing this vision to fruition. The <strong>NASI Board was formed in 1990–91</strong> and the national association was <strong>formally registered in 1994</strong>. Its initial office-bearers included the President, Secretary, Treasurer, President-Elect, and Programme Action Committee (PAC).
            </p>
          </div>

          <p>
            Meanwhile, the club network continued to expand. In <strong>April 1991</strong>, <strong>SI Poona</strong> was established under Founder President <strong>Gulshan Thukral</strong>. Aroti Dutta was NASI President, while <strong>Jane Barrie</strong>, President of SIGBI, represented the international organisation at the chartering.
          </p>
          <p>
            The movement strengthened its presence in Mumbai with <strong>SI Bombay West</strong> in <strong>September 1992</strong>, led by Founder President Nalini Mudbkatkal and mothered by SI Bombay North. On <strong>2 March 1997</strong>, <strong>SI Bombay Chembur</strong> was chartered under Founder President <strong>Dr. Daphne Pillai</strong>, mothered by SI South Bombay/Colaba. <strong>Elizabeth Hughes</strong> represented SIGBI at the chartering.
          </p>
          <p>
            The southern peninsula welcomed <strong>SI Madras (now SI Chennai)</strong> on <strong>14 December 1998</strong>. Led by Founder President <strong>Kamala Prasad</strong>, with 29 founding members, and mothered by SI Bombay North, the club marked an important step in extending the movement southwards.
          </p>
        </div>
      </section>

      {/* 5. Chapter 4: A Growing Network: 2000–2010 */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white">
            2000 – 2010
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
            A Growing Network: The New Millennium
          </h3>
        </div>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            In <strong>September 2002</strong>, <strong>SI Chennai Downtown</strong> was chartered under Founder President <strong>Gopi Narayanan</strong>, with 25 members, mothered by SI Chennai. Its founding membership comprised educators and businesswomen, some of whom were already associated with the city’s Chambers of Commerce. Kamala Prasad was NASI President at the time.
          </p>
          <p>
            On <strong>10 January 2004</strong>, <strong>SI Bangalore</strong> was established under Founder President <strong>Dr. Nalini Subbaiah</strong>, with 15 members, mothered by SI Poona. Sheela Rao (NASI) and <strong>Jackie Mosedale</strong>, President of SIGBI, attended the chartering.
          </p>
          <p>
            On <strong>21 September 2006</strong>, <strong>SI South Kolkata</strong> was chartered under Founder President <strong>Bijli Mallik</strong>, with 20 founding members, mothered by SI Calcutta. Its formation was another example of the mentoring spirit that characterised the movement. Laxmi Parasuram of SI Calcutta once again brought together a group of women from diverse professional backgrounds. <strong>Ann Dawson</strong>, President of SIGBI, arrived with a group of SIGBI officials to present the charter.
          </p>
          <p>
            On <strong>31 January 2010</strong>, <strong>SI Pune Metro East</strong> was chartered under Founder President <strong>Nisha Ghosh</strong>, with 30 founding members, mothered by SI Poona. The charter was received by Nisha Ghosh from <strong>Jackie Mosedale</strong>, President of SIGBI, in the presence of <strong>Hanne Jensbo</strong>, President of Soroptimist International, and 42 overseas Soroptimists. For the 30 founding members, the occasion offered a memorable experience of the international dimension of the organisation and the wider fellowship to which they belonged.
          </p>
          <p>
            On <strong>14 September 2010</strong>, <strong>SI Madurai</strong> was established under Founder President <strong>Anitha Rajarajan</strong>, with 25 members, mothered by SI Chennai Downtown. Annette Mascarenhas served as NASI Membership Officer during its chartering. In the years that followed, SI Madurai would itself become an active mother club, helping the movement reach several new locations across India.
          </p>
        </div>
      </section>

      {/* 6. Chapter 5: New Chapters: 2015–2021 */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white">
            2015 – 2021
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
            New Chapters & Southern Expansion
          </h3>
        </div>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            In <strong>August 2015</strong>, <strong>SI Whitefield</strong> was chartered under Founder President <strong>Rachna Gupta</strong>, with 35 founding members, mothered by SI Chennai. Shreelatha Narayanan was NASI President, while <strong>Jenny Vince</strong>, President of SIGBI, attended the chartering.
          </p>
          <p>
            The movement reached Hyderabad in <strong>November 2018</strong> with a club led by Founder President Deepika Chalasani, with 32 founding members, mothered by SI Bangalore. Latha Krishnan was NASI President, Rema Ramchandran was NASI Extension/Membership Officer, and Susan Biggs was President of SIGBI at the time. Although the club subsequently ceased to function, its formation remains part of the archival history of Soroptimism in India.
          </p>
          <p>
            On <strong>6 September 2021</strong>, <strong>SI Coimbatore</strong> was chartered under Founder President <strong>Surekha Shekhar</strong>, mothered by SI Madurai. Achina Kundu was NASI President, Anitha Rajarajan served as NASI Membership Officer, and <strong>Cathy Cottridge</strong>, President of SIGBI, attended the chartering. The club was subsequently revived in 2024 under President Kavitha Ramesh, demonstrating the possibility of renewal and fresh beginnings.
          </p>
          <p>
            On <strong>9 September 2021</strong>, <strong>SI Kochi</strong> was chartered under Founder President <strong>Dr. Beena Ravikumar</strong>, also mothered by SI Madurai. The chartering took place during the tenure of NASI President Achina Kundu, with Anitha Rajarajan as NASI Membership Officer and Cathy Cottridge as President of SIGBI.
          </p>
        </div>
      </section>

      {/* 7. Chapter 6: Reaching New Geographical Frontiers: 2022–2024 */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white">
            2022 – 2024
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
            Reaching New Geographical Frontiers: Ladakh, Kashmir & the Northeast
          </h3>
        </div>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            The following years brought Soroptimism to some of India’s most distinctive geographical and cultural landscapes, from the national capital to the high-altitude Himalayan region and the Kashmir Valley.
          </p>
          <p>
            On <strong>9 April 2022</strong>, <strong>SI Delhi</strong> was chartered under the joint founding leadership of <strong>Jaya Ahuja</strong> and <strong>Veera Malawala</strong>, mothered by SI Bangalore. Achina Kundu was NASI President, Anitha Rajarajan served as NASI Membership Officer, and Cathy Cottridge, President of SIGBI, attended the chartering.
          </p>
          <p>
            On <strong>16 July 2022</strong>, <strong>SI Leh</strong> was established under Founder President <strong>Sarla Chhewang</strong>, mothered by SI Calcutta. Anitha Rajarajan served as NASI Membership Officer, while Cathy Cottridge was present at the chartering. Situated in the dramatic high-altitude landscape of Ladakh, surrounded by the Himalayan ranges, SI Leh extended the movement into India’s northernmost mountainous region.
          </p>
          <p>
            The Kashmir Valley welcomed <strong>SI Srinagar</strong> on <strong>19 August 2023</strong>, under Founder President <strong>Parveen</strong>, mothered by SI Poona. Anitha Rajarajan was NASI Membership Officer and Cathy Cottridge, President of SIGBI, attended the chartering. With Srinagar, the movement established another vital presence in northern India.
          </p>
          <p>
            The year 2024 brought three further charterings: <strong>SI Kolkata – City of Joy</strong> was chartered on 30 September 2024 (with Anitha Rajarajan as Membership Officer, Nisha Ghosh as NASI President, and Ruth Healey, President of SIGBI); <strong>SI Chennai Marina</strong> was chartered on 22 November 2024 (mothered by SI Chennai Downtown, with Nisha Ghosh as NASI President and Cathy Cottridge representing SIGBI); and <strong>SI Guwahati</strong> in Assam.
          </p>

          <div className="p-6 rounded-2xl bg-[#FFFDEB] border border-[#F2D79A] space-y-2">
            <span className="text-xs uppercase font-bold text-[#7B580B] tracking-wider block">
              Golden Jubilee Milestone
            </span>
            <h4 className="font-serif font-bold text-lg text-[#17324D]">
              SI Guwahati Charter on Gandhi Jayanti, 2 October 2024
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-[#17324D]">
              The chartering of SI Guwahati on Gandhi Jayanti, <strong>2 October 2024</strong>, was a particularly significant milestone in the history of Soroptimism in India, marking its <strong>50th year in India</strong>. Led by Founder President <strong>Dr. Mitali Goswami</strong>, with 14 founding members, the club was mothered by SI Madurai. Naina Shah, NASI–India President-Elect, and Anitha Rajarajan, NASI Membership Officer, represented the national association, while <strong>Ruth Healey</strong>, President of SIGBI, joined the ceremony online. It became the first SI Club in Northeast India, bringing the movement to the threshold of the Eastern Himalayan foothills.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Chapter 7: The Changing Landscape, Resilience & Renewal */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
          The Changing Landscape of the Soroptimist Network
        </h3>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            The growth of a voluntary movement across a country as diverse as India brings its own challenges. Some clubs established with enthusiasm and commitment have, over time, been unable to sustain their activities.
          </p>
          <p>
            Among earlier clubs was <strong>SI Jabalpur (Jubbulpore)</strong>, representing the movement’s early presence in central India. In western India, <strong>SI Bombay West</strong> (1992, Nalini Mudbkatkal) and <strong>SI Bombay South / Colaba</strong> contributed significantly to the metropolitan network; SI Bombay South served as the mother club of SI Bombay Chembur. Historical records also reference <strong>SI Bombay Gateway of India</strong>, <strong>SI Kodaikanal</strong> in the south, and two iterations of <strong>SI Hyderabad</strong> (2002 and 2018).
          </p>
          <p>
            The journeys of these clubs remain an indelible part of the collective history of Soroptimism in India. Every club represents an aspiration, the commitment of its founding members, and an effort to extend the movement’s reach. Their experiences also remind us of the importance of sustained membership engagement, institutional support, leadership development, and continuity.
          </p>
          <p>
            The revival of <strong>SI Coimbatore in 2024</strong> under President Kavitha Ramesh is an encouraging reminder that a club’s journey need not end with a period of inactivity; with renewed commitment, a new chapter can begin.
          </p>
          <p className="font-semibold text-[#005596]">
            Today, NASI–India has 19 functioning SI clubs across the country. All Soroptimist International clubs in India belong to the SIGBI Federation – Soroptimist International Great Britain and Ireland.
          </p>
        </div>
      </section>

      {/* 9. Chapter 8: A Shared Legacy, A Continuing Purpose */}
      <section className="space-y-4 pt-4 border-t border-[#D7E8F5]">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17324D]">
          A Shared Legacy, A Continuing Purpose
        </h3>

        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#17324D]/90">
          <p>
            Soroptimism in India has travelled a remarkable geographical and social journey. Each club has contributed to this story in its own distinctive way. Some were pioneers, laying the foundations of the movement; others became mother clubs, nurturing new chapters in distant cities and regions. The presence and participation of NASI and SIGBI leaders at successive chartering ceremonies reflect the shared commitment that connects local initiatives to a wider national and international family.
          </p>
          <p>
            This spirit of unity was further exemplified by the presence of <strong>Soroptimist International President Siew Yong Gnanalingam</strong> at the installation of the NASI–India Board for 2024–2026, led by <strong>President Naina Shah</strong>, on <strong>24 November 2024 in Chennai</strong>. Her presence was a significant affirmation of the continuing bond between the Indian national association and the wider global Soroptimist movement.
          </p>
          <p>
            The enduring bonds of friendship and mentorship between mother clubs and the clubs they nurture have helped carry Soroptimism across geographical boundaries, strengthening a network united by a common purpose. NASI–India continues to provide a national platform for this collective endeavour, connecting clubs and encouraging collaboration.
          </p>
          <div className="p-6 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-2">
            <p className="font-serif italic text-base sm:text-lg text-[#005596] leading-relaxed">
              “The story belongs to every woman who has helped build it: the founders who first imagined what was possible, the members who sustained their clubs, the women whose acts of kindness inspired new beginnings, the leaders who guided the movement through changing times, and the new generations who continue to take it forward. It is a story still being written—one club, one friendship, one act of service and one life changed at a time.”
            </p>
          </div>
        </div>
      </section>

      {/* 10. Research, Editorial & Governance Credits Card */}
      <div className="rounded-3xl bg-[#F4FAFF] border border-[#D7E8F5] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D7E8F5] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#005596]">
              Archival Attribution & Governance
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-bold text-[#17324D] mt-1">
              Research, Compilation and Editorial Credits
            </h4>
          </div>
          <span className="text-xs text-[#61758A]">
            Archival Record updated 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Author & Board */}
          <div className="space-y-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#61758A] block">
                Researched, Updated and Written by
              </span>
              <p className="font-serif font-bold text-base text-[#17324D] mt-0.5">
                Sangita Choudhury
              </p>
              <p className="text-xs text-[#005596] font-medium">SI Guwahati</p>
            </div>

            <div className="pt-2 border-t border-[#D7E8F5]">
              <span className="text-[11px] uppercase font-bold text-[#61758A] block mb-1">
                Editorial Support — NASI–India Board (2026–2028)
              </span>
              <ul className="space-y-1 text-xs text-[#17324D]">
                <li>
                  <strong className="text-[#005596]">Anitha Rajarajan</strong> — President
                </li>
                <li>
                  <strong className="text-[#005596]">Anjaly Banarji</strong> — Secretary
                </li>
                <li>
                  <strong className="text-[#005596]">Anupama Sen</strong> — Communications Officer
                </li>
              </ul>
            </div>
          </div>

          {/* Sources & Acknowledgement */}
          <div className="space-y-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#61758A] block">
                Primary Historical Source
              </span>
              <p className="font-serif italic font-semibold text-sm text-[#17324D] mt-0.5">
                The History of Soroptimists in India – SIGBI
              </p>
              <p className="text-[11px] text-[#61758A] mt-1">
                Draws upon archival records, club charters, and personal discussions with senior Soroptimist leaders.
              </p>
            </div>

            <div className="pt-2 border-t border-[#D7E8F5]">
              <span className="text-[11px] uppercase font-bold text-[#61758A] block">
                Acknowledgement
              </span>
              <p className="text-xs text-[#17324D] mt-0.5">
                Acknowledging the historical compilation and foundational contributions of{" "}
                <strong className="text-[#005596]">Nisha Ghosh</strong>, Past President, NASI–India (2022–24).
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Note for reader contributions */}
        <div className="pt-4 border-t border-[#D7E8F5] text-xs text-[#61758A] leading-relaxed bg-white p-4 rounded-xl border border-[#D7E8F5] flex items-start gap-3">
          <MailIcon size={18} className="text-[#005596] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#17324D] block mb-0.5">Editorial Note:</strong>
            Every effort has been made to ensure the accuracy and completeness of the historical details presented in this account. However, any inadvertent discrepancies and omissions are open to review. Readers are kindly invited to share corrections, additional information, or archival photographs with the NASI–India Communications Officer at{" "}
            <a
              href="mailto:communications@nasiindia.com"
              className="text-[#005596] font-semibold underline hover:text-[#004780]"
            >
              communications@nasiindia.com
            </a>
            , so that the national record may be continuously updated and enriched.
          </div>
        </div>
      </div>
    </article>
  );
}
