<script>
  import Sheet from "../layout/Sheet.svelte";

  export let activePolicy;
  export let setActivePolicy;

  const contents = {
    privacy:
      "Lorem ipsum dolor sit amet, ut cum atqui audire, esse ferri adolescens vis cu. Eu pri liberavisse interpretaris, quod labore torquatos ne sed, sit ad ceteros moderatius. Omnes melius pericula mea no. Te ignota alienum temporibus sed, elit dicam ut sed. Ei ubique deleniti aliquando qui. Duo ad dicta reformidans, id vim dico veniam, cum ea probo reque assum. Ea cum dolor persius adipisci. Eu inani corrumpit vim, nec habeo constituam contentiones at, officiis deterruisset no nec. Ne prima audiam instructior sed, ad pri stet affert inermis, modo iudico ornatus per eu. In pri nulla volumus. Minimum conclusionemque cu eos, accumsan legendos in pro, vel ornatus appellantur contentiones et. Quo exerci vivendo at. Option luptatum perfecto sit in, graeci appareat appellantur te eos. Ea sea eripuit epicurei, quo ad sumo wisi adolescens. Nec everti feugiat delicatissimi id, possit ancillae argumentum nam ut. Usu et altera graeco periculis. Pro odio legere signiferumque in, ne sed quando assentior. In nec latine oportere scripserit, ad sea cibo aeterno oblique, hinc quaestio suscipiantur nam ei. Affert ancillae sententiae sed te. Dolores aliquando pri et, noluisse repudiare vim ad, mollis alterum expetenda sit ei. Velit fabulas vituperata eu cum. Modus corpora pro ut. Agam adhuc recusabo eu duo. Usu no minim laudem gloriatur, ius doctus praesent signiferumque an. Nam enim tamquam eripuit eu. Vim eligendi necessitatibus ut, ne sale nihil nec, enim accumsan scripserit eam ea. Cu consulatu interpretaris quo, ei sed etiam legere. Cu sea enim propriae suscipit. Pericula hendrerit ad ius, in cum nostrum mentitum, erant congue per ut. Esse iracundia id vis, decore eligendi eam in. Justo gubergren elaboraret ea eum. Cu mei denique splendide voluptaria. Novum sanctus habemus cu sit.",
    terms:
      "Lorem ipsum dolor sit amet, ut cum atqui audire, esse ferri adolescens vis cu. Eu pri liberavisse interpretaris, quod labore torquatos ne sed, sit ad ceteros moderatius. Omnes melius pericula mea no. Te ignota alienum temporibus sed, elit dicam ut sed. Ei ubique deleniti aliquando qui. Duo ad dicta reformidans, id vim dico veniam, cum ea probo reque assum. Ea cum dolor persius adipisci. Eu inani corrumpit vim, nec habeo constituam contentiones at, officiis deterruisset no nec. Ne prima audiam instructior sed, ad pri stet affert inermis, modo iudico ornatus per eu. In pri nulla volumus. Minimum conclusionemque cu eos, accumsan legendos in pro, vel ornatus appellantur contentiones et. Quo exerci vivendo at. Option luptatum perfecto sit in, graeci appareat appellantur te eos. Ea sea eripuit epicurei, quo ad sumo wisi adolescens. Nec everti feugiat delicatissimi id, possit ancillae argumentum nam ut. Usu et altera graeco periculis. Pro odio legere signiferumque in, ne sed quando assentior. In nec latine oportere scripserit, ad sea cibo aeterno oblique, hinc quaestio suscipiantur nam ei. Affert ancillae sententiae sed te. Dolores aliquando pri et, noluisse repudiare vim ad, mollis alterum expetenda sit ei. Velit fabulas vituperata eu cum. Modus corpora pro ut. Agam adhuc recusabo eu duo. Usu no minim laudem gloriatur, ius doctus praesent signiferumque an. Nam enim tamquam eripuit eu. Vim eligendi necessitatibus ut, ne sale nihil nec, enim accumsan scripserit eam ea. Cu consulatu interpretaris quo, ei sed etiam legere. Cu sea enim propriae suscipit. Pericula hendrerit ad ius, in cum nostrum mentitum, erant congue per ut. Esse iracundia id vis, decore eligendi eam in. Justo gubergren elaboraret ea eum. Cu mei denique splendide voluptaria. Novum sanctus habemus cu sit."
  };

  const titles = {
    privacy: "Privacy policy",
    terms: "Terms and conditions"
  };
</script>

{#if activePolicy && contents[activePolicy]}
  <Sheet
    closeSheet={() => setActivePolicy('')}
    content={contents[activePolicy]}
    title={titles[activePolicy]} />
{/if}
