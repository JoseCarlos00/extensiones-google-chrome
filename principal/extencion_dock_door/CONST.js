const tableDockContent = /*html*/ `
<table id="content">
    <thead>
      <tr>
        <th colspan="5" align="center">EMB</th>
        <th colspan="2" align="center">Otras</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>EMB-01</td>
        <td>EMB-16</td>
        <td>EMB-31</td>
        <td>EMB-46</td>
        <td>EMB-61</td>
        <td>AMZ-01</td>
        <td>MARIANO CLIENTES</td>
      </tr>
      <tr>
        <td>EMB-02</td>
        <td>EMB-17</td>
        <td>EMB-32</td>
        <td>EMB-47</td>
        <td>EMB-62</td>
        <td>AMZ-02</td>
        <td>MAY-01</td>
      </tr>
      <tr>
        <td>EMB-03</td>
        <td>EMB-18</td>
        <td>EMB-33</td>
        <td>EMB-48</td>
        <td>EMB-63</td>
        <td>DOCK-01</td>
        <td>MAY-02</td>
      </tr>
      <tr>
        <td>EMB-04</td>
        <td>EMB-19</td>
        <td>EMB-34</td>
        <td>EMB-49</td>
        <td>EMB-64</td>
        <td>DOCK-02</td>
        <td>ML-01</td>
      </tr>
      <tr>
        <td>EMB-05</td>
        <td>EMB-20</td>
        <td>EMB-35</td>
        <td>EMB-50</td>
        <td>EMB-65</td>
        <td>DOCK-03</td>
        <td>ML-02</td>
      </tr>
      <tr>
        <td>EMB-06</td>
        <td>EMB-21</td>
        <td>EMB-36</td>
        <td>EMB-51</td>
        <td>EMB-66</td>
        <td>DOCK-04</td>
        <td>TUL-01</td>
      </tr>
      <tr>
        <td>EMB-07</td>
        <td>EMB-22</td>
        <td>EMB-37</td>
        <td>EMB-52</td>
        <td>EMB-67</td>
        <td>EXT-01</td>
        <td>TUL-02</td>
      </tr>
      <tr>
        <td>EMB-08</td>
        <td>EMB-23</td>
        <td>EMB-38</td>
        <td>EMB-53</td>
        <td>EMB-68</td>
        <td>EXT-02</td>
        <td>VIRTUAL-02</td>
      </tr>
      <tr>
        <td>EMB-09</td>
        <td>EMB-24</td>
        <td>EMB-39</td>
        <td>EMB-54</td>
        <td>EMB-69</td>
        <td>EXT-03</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-10</td>
        <td>EMB-25</td>
        <td>EMB-40</td>
        <td>EMB-55</td>
        <td>EMB-70</td>
        <td>INT-01</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-11</td>
        <td>EMB-26</td>
        <td>EMB-41</td>
        <td>EMB-56</td>
        <td>EMB-71</td>
        <td>INT-02</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-12</td>
        <td>EMB-27</td>
        <td>EMB-42</td>
        <td>EMB-57</td>
        <td>EMB-72</td>
        <td>INT-03</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-13</td>
        <td>EMB-28</td>
        <td>EMB-43</td>
        <td>EMB-58</td>
        <td>EMB-73</td>
        <td>LIMPIEZA</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-14</td>
        <td>EMB-29</td>
        <td>EMB-44</td>
        <td>EMB-59</td>
        <td>EMB-74</td>
        <td>MAE-01</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-15</td>
        <td>EMB-30</td>
        <td>EMB-45</td>
        <td>EMB-60</td>
        <td>EMB-75</td>
        <td>MAR-01</td>
        <td></td>
      </tr>
    </tbody>
  </table>
`;

const tableHTML = /*html*/ `
  <div class="table-content">
    ${tableDockContent}
  </div>
`;

const modalHTML = `
<section class="modal-container">
  <div id="myModal" class="modal">
    <div class="modal-content">

    <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
      <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          class="fa-secondary"></path>
        <path fill="currentColor"
          d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
          class="fa-primary"></path>
      </svg>
    </button>
      ${tableDockContent}
    </div>
  </div>

</section>
`;

const nameDataStorgaeDoors = "doorAssigtmentList";
